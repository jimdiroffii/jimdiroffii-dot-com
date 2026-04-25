+++
date = '2026-04-01T00:00:01-05:00'
draft = false
title = 'Turn a Laptop Into an Encrypted Rocky Linux Server'
summary = 'Configuring a laptop as a Rocky Linux server: battery limits, FIPS, and remote LUKS unlock over SSH.'
tags = ['linux', 'fips']
+++

## The Task

I've been tasked by a client to turn a laptop into a Linux syslog server. Technically, a syslog collection and forwarding point for the network to send syslog up to Azure Sentinel. I love repurposing laptops into Linux machines, but a server is a whole other can of worms. Laptops just aren't made to be servers, and come with a number of challenges for staying up and powered on 24-hours a day.

## Distribution

I chose to use [Rocky Linux 9](https://rockylinux.org/) for its enterprise focus. Rocky is known to be compatible with RHEL, but developed by the community. It is a nice free option for enterprise usage. It also support FIPS 140-3 mode out of the box, which was a requirement for this configuration. I considering using a validated and hardened image from [CIQ](https://ciq.com/products/rocky-linux/pro/hardened/), but it just wasn't necessary. I also hate when a vendor won't give you a cost up front, or even after a couple emails. So, configuration from scratch it is.

## Installation / FIPS / LUKS

Enabling FIPS mode, along with LUKS disk encryption, is done during the OS installation. Once the ISO is downloaded and verified with SHA256, the ISO is copied to USB and the laptop is booted into the installer. Use `lsblk` to identify the USB drive letter (`/dev/sdb`).

```bash
# Validate SHA256
sha256sum -c <iso-filename>.iso.sha256

# Write the ISO to the USB
sudo dd if=<iso-filename>.iso of=/dev/sd<x> bs=4M status=progress && sync
```

## Power Settings / Lid Behavior

Once the OS is installed and any basic configuration is done (users, groups, updates, `sudo`, etc), we can start dealing with some of the issues presented by a laptop. One of the first to handle is the behavior of the lid closing. By default, the system will probably suspend when the lid is closed. Modify the systemd login daemon to configure these options.

```bash
sudo vim /etc/systemd/logind.conf
```

Modify any of these options if they exist:

```bash
HandleLidSwitch=ignore
HandleLidSwitchExternalPower=ignore
HandleLidSwitchDocked=ignore
```

Note that `LidSwitchIgnoreInhibited` can retain the `yes` setting. `LidSwitchIgnoreInhibited=yes` (the default) means systemd will ignore those application locks. When you close the lid, it will forcefully execute whatever action defined in `HandleLidSwitch`, no matter what applications are running.

Save the file and restart the service.

```bash
sudo systemctl restart systemd-logind
```

## Disable Wifi

Use `nmcli` to determine the WiFi radio configuration and update the settings. The WiFi adapter (as well as bluetooth) can potentially also be disabled in BIOS.

```bash
sudo nmcli radio wifi off
```

## Battery Charge

By default, the battery is going to charge to 100%. This is unnecessary, and could potentially be an issue since the laptop is never going to be unplugged. By changing the charge setting to stop at 60%, the battery is protected from overcharging or potential swelling issues that could be a hardware or fire hazard.

```bash
echo 60 | sudo tee /sys/class/power_supply/BAT0/charge_control_end_threshold
```

This is only temporary though, and will reset to 100 after a reboot. A service must be created to modify the setting at boot.

```bash
sudo vim /etc/systemd/system/asus-battery-limit.service
```

Configure the new service:

```bash
[Unit]
Description=Set Asus Battery Charge Limit
After=multi-user.target

[Service]
Type=oneshot
ExecStart=/bin/bash -c 'echo 60 > /sys/class/power_supply/BAT0/charge_control_end_threshold'

[Install]
WantedBy=multi-user.target
```

And enable the new service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now asus-battery-limit.service
```

## Dealing with LUKS at Boot

By default, a disk with LUKS encryption will require entry of the passphrase to decrypt the disk at boot. This is a problem if the laptop is going to be stored in a cabinet somewhere. The solution is to enable networking with SSH in the initramfs environment. Many guides use [dropbear-initramfs](https://www.dwarmstrong.org/remote-unlock-dropbear/) for this purpose, but `dracut` comes with the utilities necessary.

First, setup the extra package repo, and then install the special `sshd` and `network` packages:

```bash
sudo dnf install epel-release -y
sudo dnf install dracut-sshd dracut-network -y
```

You can only use a SSH key for logging into initramfs, so setup an authorized keys file for the root user:

```bash
sudo su -
mkdir -p /root/.ssh
chmod 700 /root/.ssh
vim /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
```

This laptop only has a wifi adapter, so I'm using a USB dongle to provide a wired ethernet connection. I need to force the driver into dracut. The driver in use can be found by looking up the interface and driver module.

```bash
# Get the interface name
ip a
# Get the driver name
ethtool -i <your_interface_name>
```

Create a custom dracut config to force the driver selection:

```bash
sudo vim /etc/dracut.conf.d/10-usb-net.conf
```

And add this line (my driver was `cdc_ncm`, yours may be different). **RETAIN THE SPACES** inside the quotes:

```bash
add_drivers+=" cdc_ncm "
```

It is now necessary to instruct the kernel to init the USB interface and wait for an IP address. This configuration is using DHCP, but may be slightly different if a static IP is used. I prefer for the DHCP server to give a preassigned address over DHCP:

```bash
# My interface name is: enp0s20f0u3c2
sudo grubby --update-kernel=ALL --args="rd.neednet=1 ip=enp0s20f0u3c2:dhcp rd.net.timeout.carrier=15 rd.net.timeout.ifup=30"
```

Finally, rebuild the boot image:

```bash
sudo dracut -v -f
```

And reboot. If all went well, the system will hang while it waits for the LUKS passphrase. But, you can login via SSH using `root`, and run `systemd-tty-ask-password-agent` to get the password prompt. The SSH connection will close immediately if successful.
