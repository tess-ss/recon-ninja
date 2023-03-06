# Recon-Ninja

The tool is a GitHub repository that provides a recon tool that lets you upload your domain discovery through an upload option. The tool utilizes HTTPX, which is a tool that scans for alive domains. The tool also has an integrated MongoDB Atlas database, which is a cloud-based database that allows the tool to store the recon data.

Users can interact with the tool through a user interface (UI) that provides a searchable view of the uploaded subdomains. The UI also distinguishes title cname and provides a search option to easily navigate through the uploaded data of subdomains.

Additionally, the tool provides the ability to run Nuclei in the backend via the UI. Nuclei is a tool that is used for vulnerability scanning and is commonly used in conjunction with other reconnaissance tools. Users can receive notifications via Discord when the Nuclei scan is complete.

Overall, your tool provides an efficient and effective way to gather and store recon data, as well as easily search and navigate through the collected data via a user-friendly UI. The integration of Nuclei and Discord notifications also adds value to the tool by providing additional scanning capabilities and easy notifications of completed scans.

### To get started, please follow these steps:

Go to https://www.mongodb.com/atlas/database and create an account. You can choose between a free or paid account based on your needs.
Once you've created your account, you may find it helpful to install the UI App, MongoDB Compass, from https://www.mongodb.com/try/download/compass. This tool can help you manage your database more easily.

After setting up the database, please save the database connection URL as we will need it later for this tool.


## Installation

* Please clone this repository

```
https://github.com/tess-ss/recon-ninja.git
```
* much wow, would you look at that? The main folder is called 'recon-ninja/' and it even comes with two bonus folders inside: 'Frontend/' and 'Backend/'. How convenient!"

* Well, well, well, it's time for the exciting part! Move to 'cd /recon-ninja' and check if you have hit the jackpot by using 'ls'. You should see the magical 'Frontend/' and 'Backend/' folders waiting for you inside

* Go to the `/Frontend` directory and do the following:

```
npm install
```

Change the backend api path to your server's ip in `src/axiosConfig.js`
```
axios.defaults.baseURL = 'http://ip:port/';
```

Make a production build of the react app:

```
npm run build
```


* Now, move to `/Backend` and do the following. Like cd /Backend and now do the following which is 

Install the dependencies:

```
npm install
```

Move the `build` folder of Frontend to the root directory

```
mv ../Frontend/build .
```

Apply the following:
* Assign mongodb uri in `db.js` in function `mongoose.connect`
* Change the constant `discordWebhookUrl` in `app.js`

Open redis server before running the app: (If you do not have redis-server, Please install it via `sudo apt-get install redis-server`)
```
redis-server
```

Create an `uploads` folder
```
mkdir uploads
```

Install pm2 server to host the nodejs app:
```
npm i pm2 -g
```

Start the app:
```
pm2 start app.js
```
The app would be running on port `3000` (you could change the port number if you want to by changing the port number on `app.listen` function in `app.js`)


























Feel free to use my Digital Ocean reference link to set up a VPS, if you're interested





[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=b837565c0b6b&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)
