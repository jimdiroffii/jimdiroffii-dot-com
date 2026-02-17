# Jim Diroff II Personal Site

[![Deploy Hugo Site](https://github.com/jimdiroffii/jimdiroffii-dot-com/actions/workflows/deploy-docker-jimdiroffii-dot-com.yml/badge.svg)](https://github.com/jimdiroffii/jimdiroffii-dot-com/actions/workflows/deploy-docker-jimdiroffii-dot-com.yml)

## Todo

- [ ] Fix Firefox single-line code block rendering

> TODO: There is an issue with Firefox rendering of single-line code blocks. The spacing between the line number and code syntax. When the code is rendered from Hugo, a newline is added after the line number, and the following `span` closing tag gets pushed to the next line. If the newline is removed, the code block renders correctly. This issue is not present in the default styling of code blocks when setting up a new Hugo template in any browser. The issue is also not present in Chrome with my current styling. Something in my CSS is causing Firefox to render the code block incorrectly when there is only a single line.
