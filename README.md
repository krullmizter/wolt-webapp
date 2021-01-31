# Wolt internship 2021 Backend task

## By: [Samuel Granvik](https://github.com/krullmizter)

---

### About

I began by reading the [task](https://github.com/woltapp/summer2021-internship). It specified that one could do the frontend or backend task. I choose to do the backend task with:

* Node.js
* Express.js
* Typescript

---

### Execution
To get the Node web-app to work one only has to download the source code, and have installed:

* Node
* NPM
* NPX

Then after that `cd` in to the root folder of the webapp and run: `npm i` (to install any dependencies). After that one can run `npx ts-node app.ts` or `npm start` (that works with nodemon) to get the local server running on http://localhost:8081

The webapp the uses http://localhost:8081/discovery as the API endpoint, and can from there take the valid arguments for latitude and longitude. 
For example: `http://localhost:8081/discovery?long=60.185625&lat=24.950689`


### Issues
One of the main issues with the code is that it now doesn't take in restaurants which are closed. I tried to solve this via some while-loops inside the app.ts (lines: 77 - 78). I didn't have anymore time to fix these issues before handing in the task.

The app could be vastly improved and built upon, but in its core it to 90% works as the task specified.