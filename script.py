import sys
import json
a=[]
with open(sys.argv[1],"r") as file:
    for line in file:
        a.append([line.rstrip()])
d={"name":sys.argv[1],"domains":a}

with open(f"{sys.argv[1]}.json","w") as outfile:
    json.dump(d,outfile)
