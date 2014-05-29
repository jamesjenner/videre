Videre
======

View and interact with remote automated vehicles

This project implements a cross platform multi-touch enabled application for the purpose of interacting with multiple autonomous vehicles. This project was initialy developed as a major project at QUT.

The software is designed to leverage html5, css3 and javascript for the purposes of code reuse across multiple platforms, thus reducing costs.

An implementation using phone gap can be built that allows the software to run as a native application under iOS and Android based devices.

Due to the focus on HTML5, the focus for compatibility is only the latest versions of firefox, chrome and safari. The goal is to eventually be compliant with HTML5 and remove all browser specific tags.

Citation
--------
If you find this software useful and wish to cite then please reference it as:
James G. Jenner and Luis Mejias "Towards the Development of 1-to-n Human Machine Interfaces for Unmanned Aerial Vehicles", in proceedings of the 2014 International Conference on Unmanned Aerial Systems (ICUAS'14). (in press)

Bibtex entry:

@inproceedings{Jenner:2014aa,
    Author = {James G. Jenner and Luis Mejias},
    Booktitle = {International Conferences on Unmanned Aerial Vehicles},
    Date-Added = {2014-05-28 20:10:37 +0000},
    Date-Modified = {2014-05-28 20:12:12 +0000},
    Pages = {},
    Title = "Towards the Development of 1-to-n Human Machine Interfaces for Unmanned Aerial Vehicles},
    Year = {2014}
    }


Submodules
----------
The submodule videre-common is located within this project. When cloning this project the directory for videre-common will exist but it will not have any files. To retreive the files for the submodule for the first time perform the following:

```
git submodule init
git submodule update
```

To update the submodules perform the following:

```
git submodule init
git submodule update
cd videre-common
git checkout master
git pull
```
The above presumes that the desired branch is master.

Refer to http://git-scm.com/book/en/Git-Tools-Submodules#Starting-with-Submodules for further information.
