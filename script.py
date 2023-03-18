import sys
import json
a=[]
filename=sys.argv[1].split('/')[-1]
with open(sys.argv[1],"r") as file:
    for line in file:
        a.append([line.rstrip()])
d={"name":filename,"domains":a}

with open(f"{filename}.json","w") as outfile:
    json.dump(d,outfile)
