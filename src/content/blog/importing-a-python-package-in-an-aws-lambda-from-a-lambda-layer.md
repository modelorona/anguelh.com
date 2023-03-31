---
title: Importing a Python package in an AWS Lambda from a Lambda Layer
pubDate: 2022-09-24T17:38:31.850Z
description: " "
---
If you have a lambda layer with a package named "X", at the top of your function, write:


```python
import sys

sys.path.append('/opt/X/')
```



A﻿WS attaches the layer under the /opt directory. The above code adds that to the list of directories that the Python interpreter will search through when trying to find packages.
