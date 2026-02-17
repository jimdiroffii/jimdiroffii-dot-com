+++
date = '2026-02-16T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 027'
summary = ''
+++

Following up from yesterday's server administration, I checked on my recidive jail, and found that no clients had been banned. This was clearly an error since I could manually check the logs and see many repeat offenders. There was one change I had to make to the configuration.

```ini
[recidive]
enabled  = true
filter   = recidive
logpath  = /var/log/fail2ban.log
backend  = polling      # <--- Add this line
findtime = 1d
maxretry = 2
bantime  = 1y
```

By default, fail2ban was using the systemd journal to find repeat offenders, but the log is being stored in fail2ban's own log. It was necessary to add `backend = polling` to the configuration to force f2b to read its own log file.

Instead of doing coding today, I'm going to pivot to security. Both coding and security go hand-in-hand, although I've considered doing a _365 days of security_ challenge as well. Let's see how this goes.

## USCC - Cyber Quest Spring 2026

I stumbled across the [United States Cyber Challenge](https://www.uscyberchallenge.org/) today, and decided to compete in the Spring 2026 challenge. The challenge involves a scenario, and you are given 6 pcap files to analyze. After the analysis, you are invited to take part in a quiz, where you get three attempts. The best score in the lowest amount of time wins the challenge.

### The Scenario

> A small utility in an unnamed locale has a small SCADA test environment setup. The staff at this utility have installed a DSL line to enable remote access to this system. Unfortunately, the utility staff did not adequately consider the security implications of doing this, leaving the test environment open to attack from the internet.
>
> After experiencing odd behavior on this system, the lead engineer began looking at system logs and network traffic in an attempt to troubleshoot the issue. He discovered what appeared to be unauthorized access into the system. You have been called in to examine this evidence and help determine what has occurred.
>
> Your task, should you choose to accept it, is to examine these evidentiary artifacts to determine what has happened, and provide answers to the following questions.

Let's begin...

### Preliminary Research

#### The SCADA environment

SCADA, or _Supervisory Control and Data Acquisition_, is an Industry Control System (ICS) architecture framework. A SCADA system acts as the brain of the ICS, both relaying commands (Control) and collecting data (Data Acquisition). A SCADA system is managed either locally or remotely by a human operator via a Human-Machine Interface (HMI).

What we don't know is the exact type of SCADA system we are dealing with. There are different SCADA protocols, and many different SCADA vendors. Each system will have different traffic patterns, data, ports, and commands.

Here is a list of the most commonly used protocols, ports, vendors and usages.

| Protocol          | Port        | Vendor                               | Description                                                   |
| :---------------- | :---------- | :----------------------------------- | :------------------------------------------------------------ |
| Modbus TCP        | 502         | Schneider Electric, ABB, many others | The most common, unencrypted "lingua franca" of ICS.          |
| S7Comm            | 102         | Siemens (S7-300/400/1200/1500)       | Proprietary protocol for Siemens PLCs.                        |
| EtherNet/IP / CIP | 44818       | Rockwell (Allen-Bradley)             | Modern industrial Ethernet protocol for ControlLogix.         |
| DNP3              | 20000       | Utilities (Water/Electric/Gas)       | Highly robust, used for remote telemetry in the field.        |
| IEC 60870-5-104   | 2404        | European Utilities / Power Grid      | Standardized protocol for telecontrol in power systems.       |
| BACnet            | 47808 (UDP) | Building Automation (HVAC, Fire)     | Controls smart building features (often high-volume traffic). |
| Niagara Fox       | 1911, 4911  | Tridium (Building Management)        | Common in commercial facility management systems.             |
| FINS              | 9600        | Omron                                | Factory Interface Network Service; specific to Omron PLCs.    |
| Crimson V3        | 789         | Red Lion                             | Used for Red Lion HMI communication and programming.          |
| OPC UA            | 4840        | Cross-vendor (Modern standard)       | The secure, object-oriented successor to "OPC Classic."       |

Identification of the parts of a SCADA system from packet analysis will likely come down to reading the packet headers, transmission behavior (such as polling), and any plaintext data fields. A SCADA server (Master Station) will generally poll devices on a regular schedule, such as every 500 ms. PLCs talking to each other could be indicative of P2P communication, or lateral movement by an attacker.

These are some of the behaviors that can be identified from a packet analysis of a SCADA system:

- Modbus TCP uses a **Unit ID** in communications, and traffic cycling through IDs 1-254 is likely trying to scan for slave devices.
- Modbus uses a standard packet size of 260 bytes. Large payloads could trigger a buffer overflow.
- DNP3 uses a **Internal Indications** or **IIN** field when responding to requests. Look for _Configuration loss_ or _Device Trouble_ in the responses to indicate an exploit has succeeded.
- CIP uses **Service Codes** such as `0x4B` to _Apply Attributes_ or `0x4C` to _Create_, which modify a PLC's logic.
- Identify packets that have a 24/7 heartbeat structure versus one-off events.
- Verify function codes to determine the action being taken, such as a _Read_ or _Write_ operation.
- Verify function codes being sent from an unknown or external IP.
- Look for high volumes of `SYN` packets targeting common SCADA ports.
- SCADA comms are typically unencrypted and/or do not support authentication. A SCADA device may execute any command sent to it, regardless of source.

##### MITRE ATT&CK Campaigns

There are at least two campaigns that involved SCADA systems identified in the MITRE ATT&CK framework. These

1. `C0034`: [2022 Ukraine Electric Power Attack](https://attack.mitre.org/campaigns/C0034/)
1. `C0002`: Night Dragon

###### C0034 ICS Techniques

| ID                                                 | Name                          | Use                                                                                                                                                                                                                                                                                                                                         |
| :------------------------------------------------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [T0895](https://attack.mitre.org/techniques/T0895) | Autorun Image                 | Sandworm Team used existing hypervisor access to map an ISO image named `a.iso` to a virtual machine running a SCADA server. The SCADA server's OS was configured to autorun CD-ROM images, and a malicious VBS script on the ISO was automatically executed.                                                                               |
| [T0807](https://attack.mitre.org/techniques/T0807) | Command-Line Interface        | Sandworm Team leveraged the SCIL-API on the MicroSCADA platform to execute commands through the `scilc.exe` binary.                                                                                                                                                                                                                         |
| [T0853](https://attack.mitre.org/techniques/T0853) | Scripting                     | Sandworm Team utilizes a VBS `lun.vbs` to execute `n.bat` which then executed the MicroSCADA `scilc.exe` command.                                                                                                                                                                                                                           |
| [T0894](https://attack.mitre.org/techniques/T0894) | System binary Proxy Execution | Sandworm Team executed a MicroSCADA application binary `scilc.exe` to send a predefined list of SCADA instructions specified in a file defined by the adversary, `s1.txt`. The executed command `C:\sc\prog\exec\scilc.exe -do pack \scil\sq.txt` leverages the SCADA software to send unauthorized command messages to remote substations. |
| [T0855](https://attack.mitre.org/techniques/T0855) | Unauthorized Command Message  | Sandworm Team used the MicroSCADA SCIL-API to specify a set of SCADA instructions, including the sending of unauthorized commands to substation devices.                                                                                                                                                                                    |

###### C0002 ICS Techniques

There are no ICS techniques specifically called out in the MITRE analysis of the campaign, only that SCADA information was stolen.

##### Stuxnet

Of particular note is [Stuxnet](https://attack.mitre.org/software/S0603/), the first reported malware used to target ICS systems specifically. Stuxnet was a complex piece of software, and used many different techniques to accomplish the attacker's goals. Dave Plummer, the retired Microsoft engineer, did a story on the malware on [YouTube](https://youtu.be/EOPLN-MVKY4?si=shT-mL_wuinbCRQp). There is also a highly-rated book on the topic, [_Countdown to Zero Day_](https://www.amazon.com/Countdown-Zero-Day-Stuxnet-Digital/dp/0770436196) by Kim Zetter.

#### Packet Captures

We are given 6 pcap files to analyze.

1. web_recon.pcap
1. init.recon.pcap
1. entry.pcap
1. hmi_web_recon.pcap
1. HMI2PLC.pcap
1. ettercap.pcap

Based on the names of these files, we can make some assumptions about what the are likely to contain. These assumptions are made to help guide the research, and are not definitive, since the pcap files have not been reviewed yet.

- `web_recon.pcap`

The initial reconnaissance phase by the attacker. Likely to contain port sweeps, remote IP addresses, `GET` and `POST` requests, `404` errors from directory/file scanning, and other recon techniques.

- `init.recon.pcap`

Another initial reconnaissance phase by the attacker, likely more specific to identifying ICS system components. Look for traffic to specific SCADA-related ports, along with fingerprinting techniques. There may also be information regarding the initial access.

- `entry.pcap`

The likely entry into the system from the attacker. The actual attack that gained initial access to the network is likely here. Look for things such as RDP, SSH, or a known exploit such as `log4j`.

- `hmi_web_recon.pcap`

Once the network infiltration was established, the attacker began looking for the HMI. Look for brute-force login attempts.

- `HMI2PLC.pcap`

Likely to be a man-in-the-middle (MITM) recon of standard HMI to PLC traffic.

- `ettercap.pcap`

Likely to be the active MITM attack. Look for potential [ARP Poisoning](https://attack.mitre.org/techniques/T1557/002/) by focusing on multiple IP addresses having the same MAC address.

### PCAP Analysis

#### web_recon.pcap

This is the first file that has been analyzed. First, let's get an overview of what is happening, where it is happening, and why it is happening.

##### IP Analysis

There are only two IPs communicating on this capture:

- IP: `10.1.10.33`: MAC: `08:00:27:fb:b8:10`
- IP: `10.1.10.130`: MAC: `00:0f:73:02:52:51`

The MAC organization IDs are:

- `.33`: `08:00:27` = `PCSSystemtec`
- `.130`: `00:0f:73` = `RSAutomation`

The `.33` address is sending a lot of `GET` requests to `10.1.10.130`, which is often responding with a `200 OK` and data. This tells us that `.33` is likely a client, and `.130` is a server. It is interesting that both IP addresses are on the same segment of `10.1.10.x`. This could just be a lab environment anomaly. A `10.x.x.x` address wouldn't be coming from the internet.

Upon filtering for just HTTP traffic by setting the filter to `http`, it is apparent that `.33` is talking to a webserver hosted at `.130`. Using Wireshark's capabilities, I'll save all the HTTP objects. `File > Export Objects > HTTP`, and reconstruct the web page.

###### File list

- `refresh.js`
- `navtree.js`
- `URLhdl.js`
- `TableList.js`
- `ralogo.gif`
- `paper.gif`
- `msonoff.gif`
- `msoffon.gif`
- `mendon.gif`
- `mendoff.gif`
- `foldsel.gif`
- `folder.gif`
- `ablogo.gif`
- `radevice.css`
- `navtree.css`
- `redirect.htm`
- `newdata.htm`
- `netstat.htm`
- `netset.htm`
- `navtree.htm`
- `home.htm`
- `header.htm`
- `err.htm`
- `diagover.htm`
- `dataview.htm`
- `adm_user.htm`
- `\` (`index.htm`, presumably)

##### Website

I renamed the file from `\` to `index.htm` and opened it in the browser. There is a lot of information to grab from this page:

- Device Name: `1763-L16BWA B/9.00`
- Device Description: `MicroLogix 1100 Processor`
- MAC Address: `00-0F-73-02-52-51`
- IP Address: `10.1.10.130`
- OS Revision: `Series B FRN 9.0`
- HTML File Revision: `1.10`
- Current Time: `RTC is disabled`
- CPU Mode: `Rrun`

We can also see branding of `Allen-Bradley` and `Rockwell Automation` on the page. Clicking through the navigation tree provides a few more bits of data.

- Subnet Mask: `255.255.255.0`
- Default Gateway: `10.1.10.1`

There is also a copyright of `2005 Rockwell Automation`.

Looking at the files directly provides a blast from the past. Framed webpages, table layouts, and deprecated functionality. There are some hidden input fields, and sections of the webpages that are not accessible, such as the `User Management` page. It gives an `Access Denied` message, requesting administrator privilege.

The client PC has this user agent:

```bash
Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.24) Gecko/20111107 Ubuntu/10.04 (lucid) Firefox/3.6.24
```

#### init.recon.pcap

In this file, there is a lot more network traffic. There are several protocols in use, and lots of communications between different devices.

Protocols: `0x0000` (some type of multicast), `arp`, `browser` (`smb`), `dns`, `http`, `ssdp`, `sshv2`, `tcp`, and `telnet`

- Source Addresses (`10.1.10.x`): `.1`, `.10`, `.12`, `.13`, `.15`, `.16`, `.20`, `.27`, `.29`, `.33`, `.60`, `.130`
- Other Source Addresses: `172.31.255.28`

Through the HTTP requests, we get some timestamps, which may be useful at organizing data across the pcaps.

This pcap has a date in the HTTP header of around: `Tue, 31 Jan 2012 06:48:46 GMT`.

Additionally, when the attacker tried to access the webpage at `.20`, he was met with a 401 access denied. But, the headers from the server indicate `Digest realm="PeakHMI"`, which is a reference to _Everest Software, LLC_, who makes/made [PeakHMI](https://www.hmisys.com/HMI/Main.htm). Per their website: "PeakHMI is a full featured, robust Human Machine Interface (HMI) suite designed with engineering, operations and management goals at the forefront of development and product roadmap."

##### arp

Through `arp`, we get a mapping of the network, which was requested via broadcast from `10.1.10.33`.

| Sender MAC        | Sender IP   | Sender Device OUI |
| :---------------- | :---------- | :---------------- |
| f0:b4:79:02:0d:20 | 10.1.10.10  | Apple             |
| 88:87:17:49:66:07 | 10.1.10.12  | Canon             |
| 00:0b:82:21:ad:07 | 10.1.10.13  | GrandstreamN      |
| 00:0b:82:20:3a:43 | 10.1.10.15  | GrandstreamN      |
| 00:0b:82:1f:7b:91 | 10.1.10.16  | GrandstreamN      |
| 14:fe:b5:ab:23:be | 10.1.10.20  | Dell              |
| 00:0b:82:21:ab:af | 10.1.10.27  | GrandstreamN      |
| 00:00:74:d1:a0:8b | 10.1.10.29  | Ricoh             |
| 08:00:27:fb:b8:10 | 10.1.10.33  | PCSSystemtec      |
| 54:52:55:53:54:1f | 10.1.10.60  | _none_            |
| 00:0f:73:02:52:51 | 10.1.10.130 | RSAutomation      |

- GrandstreamN is _Grandstream Networks_. They make network devices such as switches and Wi-Fi APs.
- Apple is a computer manufacturer.
- Canon makes imaging devices, such as cameras and printers.
- Dell is a computer manufacturer.
- Ricoh is known for printers.
- PCS Systemtechnik GmbH is a German manufacturer of hardware and software for security and data collection. ID cards, cameras, time-clocks, etc.
- RS Automation makes automation controllers, such as PLCs.

##### ssh > arp > dns > tcp port scanning > ssh

The pcap file begins with SSHv2 communications between `10.1.10.33` and `172.31.255.28`. `10.1.10.33` is the client communicating from port `2200` to the SSH server `172.31.255.28` with open port `45385`. The data exchanged is encrypted. Once the initial communication rests, `.33` sends the ARP broadcast across the local network. Once the ARP request finishes, each live IP is queried for PTR records using DNS to `.1` from `.33`.

After the DNS request finishes, `.33` begins scanning for open ports on the live IPs using `SYN`.

- Ports scanned, in order: `443`, `21`, `80`, `3389`, `22`, `23`

After the port scanning, the SSH communication resumes between `.33` and `172.31.255.28`.

The cycle continues with `.33` trying open ports on devices and then reporting back to `172.31.255.28` over SSH.

##### Web Pages and HTTP Requests

Several clients respond with HTTP on port `80`.

- `.12`, `.13`, `.15`, `.16`, `.20`, `.27`, `.29`, `.130`

Most of the data returned over HTTP/HTML is not very useful, but all of the Grandstream devices return with a login page.

- `.20` returns with a 401 access denied message. The header reveals some information about PeakHMI. Several subsequent requests were made using different usernames for access: `admin`, `hmi`, `paswd`.

Request:

```plaintext
Authorization: Digest username="paswd", realm="PeakHMI", qop="auth", algorithm="MD5", uri="/", nonce="I1osImH940AjoeBGX5YDlYkeTOM5SZWb", nc="00000001", cnonce="4f278efa", response="8784f80c968b6620654be1d871cf8e4a", opaque="6SeQYUMaE0W8R3H2f9io2cy6axpPZ3Bf5o"
```

Response:

```plaintext
WWW-Authenticate: Digest realm="PeakHMI",qop="auth",nonce="ACH1IGH940A4rCqTQFvLKXEXiSoU9HiY",opaque="nfsturI7lB30Yh159SBianeBj4mHrYR49S"
```

- `.29` returns with a page title of `Web Image Monitor`.

- The user-agent of the `.33` device has changed in this file:

```plaintext
lwp-request/5.834 libwww-perl/5.834
```

> `lwp-request` is a Linux program that allows sending requests to web servers and file systems.

##### smb / browser

The Canon device at `.12` sends a host announcement near the end of the pcap advertising SMB. It advertises `SMB MailSlot Protocol` with a _Mailslot Name_ of `\MAILSLOT\BROWSE`. There is also a comment about the Canon being `MX880 series`. This is likely a reference to the _Canon PIXMA MX88x_ series of printers.

##### rdp

The Dell computer at `.20` sent back a valid SYNACK for port `3389`, meaning RDP is open on this device. No other data was exchanged on this port.

##### telnet

The Ricoh at `.29` was open to telnet communication, and there was some communication over this port. 3 attempts were made to attempt to log into the Ricoh Maintenance Shell over telnet, but all were unsuccessful.

##### Conclusion

I think we can conclude the `.33` is a compromised host in the network, and `172.31.255.28` is a C2 server. There is no indication yet as to how the attacker was able to get into `.33` in the first place. What we can see is that `.33` is executing commands on the network, and then is most likely communicating to `172.31.255.28` the results of those commands.

#### entry.pcap

This is a simpler file, but we get some extra information on the network.

Through SMB advertisements, we get some hostname data:

- `10.1.10.12` > Hostname: `496607000000`
- `10.1.10.29` > Hostname: `RNPD1A08B`

Through ARP requests, we get the MAC of `.1`: `00:26:f3:30:1f:e2`. The OUI of `.1` is _SMCNetworks_.

Then the real work begins.

`172.31.255.28` sends a TCP packet to `.33`. `.33` responds, and then the gateway at `.1` sends an ARP request for `.20`. Once the ARP request finishes, the C2 server at `172.31.255.28` connects to `.20` over RDP `3389`.

The C2 server attempts to SSH to `.60` but gets a protocol mismatch.

The C2 server at `172.31.255.28` has now communicated directly with `.20`, `.33`, and `.60`.

#### hmi_web_recon.pcap

Here we get a successful login to the HMI server living at `.20`. The name `fmeyer` was used to login successfully.

Here is the full request and response:

```plaintext
GET / HTTP/1.1
Host: 127.0.0.1:8080
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.52.7 (KHTML, like Gecko) Version/5.1.2 Safari/534.52.7
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us
Accept-Encoding: gzip, deflate
Authorization: Digest username="fmeyer", realm="PeakHMI", nonce="N6l8J53940BWi/157IWaddI06/ZULzyP", uri="/", response="e84d8e1c7e3506b2d9ebdbe42068919d", opaque="JvnGjaphFchhqB1MDFM7nT1FdpqSANZM6f", cnonce="0666a9f219af1e86d488531fc67d5d66", nc=00000001, qop="auth"
Connection: keep-alive


HTTP/1.1 200 OK
Content-Type: text/html
Connection: Keep-Alive
Keep-Alive: timeout=10, max=99
Content-Length: 711

<HTML><HEAD><TITLE>CYBATI HMI</TITLE></HEAD><BODY style="background:#FFFFFF"><H2>CYBATI HMI Webserver </H2><A HREF="/SCRL.html">Screens</A><BR><BR><A HREF="/ATL.html">Analog Tags</A><BR><A HREF="/AHTL.html">Analog Host Tags</A><BR><A HREF="/APHTL.html">Analog Pointer Host Tags</A><BR><BR><A HREF="/DTL.html">Digital Tags</A><BR><A HREF="/DHTL.html">Digital Host Tags</A><BR><A HREF="/DPHTL.html">Digital Pointer Host Tags</A><BR><BR><A HREF="/PORTS.html">Port Tags</A><BR><BR><A HREF="/SCRIPTS.html">Scripts</A><BR><BR><A HREF="/ACTIVEALARMS.html">Active Alarms</A><BR><A HREF="/ALARMLOGS.html">Alarm Logs</A><BR><A HREF="/EVENTLOGS.html">Event Logs</A><BR><BR><A HREF="/CTL.html">Cameras</A><BR></BODY></HTML>
```

Looking through the HTTP objects, there are always 2 requests back to back for the same URI. The first request is denied, and the second request is successful.

Looking at the data that was produced in the HTTP objects, we can see the `fmeyer` was logging in normally from `10.1.10.18` before the attacker started logging in from `.33`.

The rest of the pages are mostly demo alarm data. There is an image that shows the overall architecture demo.

#### HMI2PLC.pcap

This appears to be normal HMI to PLC communication. The HMI is at `10.1.10.20`, and the PLC is at `10.1.10.130`.

About every 1.5 seconds, `.20` sends the `Execute PCCC (0x4b)` request to `.130`.

Not much else is happening here.

#### ettercap.pcap

This is a large packet capture, compared to the others. There is a lot going here. Ettercap is a comprehensive suite for MITM attacks, and appears to have sniffed all available data off of the line.

There is a lot of CIP PCCC traffic between `.20` and `.130`, but nothing else terribly interesting from my initial analysis.

What needs to be analyzed here is ARP Spoofing.

### The Quiz

I got 75.86% on my first attempt, and I did not detect the ARP spoofing before I made my first attempt. I'm also unsure about how to do the time adjustments to the packets in Wireshark, so I think I got those questions wrong too. Will try again!
