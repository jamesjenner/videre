Videre
======

View and interact with remote automated vehicles

This project implements a cross platform multi-touch enabled application for the purpose of interacting with multiple autonomous vehicles. This project was initialy developed as a major project at QUT.

The software is designed to leverage html5, css3 and javascript for the purposes of code reuse across multiple platforms, thus reducing costs.

An implementation using phone gap can be built that allows the software to run as a native application under iOS and Android based devices.

Due to the focus on HTML5, the focus for compatibility is only the latest versions of firefox, chrome and safari. The goal is to eventually be compliant with HTML5 and remove all browser specific tags.


The submodule videre-common is located within this project. When cloning this project the directory for videre-common will exist but it will not have any files. To get the files for the submodule perform the following:

```
git submodule init
git submodule update
```

Refer to http://git-scm.com/book/en/Git-Tools-Submodules#Starting-with-Submodules for further information.
