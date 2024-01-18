const http = require('http');
const db_connect = require("./mongodb");
const { ObjectId } = require('mongodb');
const server = http.createServer((req, res) => {

  res.writeHead(200, { "content-Type": "text/html" })

  if (req.url.startsWith('/todo/get/')) {
    const get_data = async () => {

      try {
        const Id = req.url.substring(10);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const result = await db_connect()
        const userId = new ObjectId(Id);
        const data = await result.find({ _id: userId }).toArray()
        console.log(data)
        const responseJson = JSON.stringify(data, null, 4)
        res.end(responseJson)
      } catch (error) {
        console.error('Error retrieving data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    }
    get_data();
  }


  else if (req.url === '/todo/create' && (req.url.length === 12)) {
    if (req.method === "POST") {
      const insert = () => {
        let request_body = ""
        req.on("data", (chunk) => {
          request_body += chunk.toString()
        })
        req.on("end", async () => {
          try {
            const db = await db_connect()
            const insert_data = JSON.parse(request_body)
            const keys = Object.keys(insert_data)
            const thing = keys[0];
            const Start_timing = keys[1]
            const End_timing = keys[2]
            const extra = keys.slice(3);
            if (!(thing === "What_do_you_want") || !(Start_timing === "Start_time") || !(End_timing === "End_time") || extra.length > 0) {
              res.end("Only What_do_you_want, Start_time, End_time allowed")
              console.log("Only What_do_you_want, Start_time, End_time allowed")
            }
            else {
              await db.insertOne(insert_data);
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end("Data inserted successfully");
              console.log("data inserted succesfully");
            }

          }
          catch (error) {
            console.error('Error retrieving data:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          }
        });

      }
      insert()


    }
    else {
      res.end("Go to postman for insert new todo list Data ")
    }

  }

   else if (req.url.startsWith('/todo/delete/') || (req.method ==="DELETE")) {
    const delete_data = async () => {
      try {
        const Id = req.url.substring(13);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const result = await db_connect()
        const userId = new ObjectId(Id);
        await result.deleteOne({ _id: userId })
        res.end("data deleted successfully")
        console.log("Data deleted successfully")
      } catch (error) {
        console.error('Error retrieving data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }


    }
    delete_data()
  }

  else if(req.url.startsWith("/todo/update/")){
    if (req.method === "PUT") {
      const update_data = () => {
        let request_body = ""
        req.on("data", (chunk) => {
          request_body += chunk.toString()
        })
        req.on("end", async () => {
          try {
            const data= JSON.parse(request_body)
            res.writeHead(200, { 'Content-Type': 'text/html' });
            const result = await db_connect()
            const Id = req.url.substring(13);
            const userId = new ObjectId(Id);
            console.log(data)
            const keys = Object.keys(data)
            const thing = keys[0];
            const Start_timing = keys[1]
            const End_timing = keys[2]
            const extra = keys.slice(3);
            if (!(thing === "What_do_you_want") || !(Start_timing === "Start_time") || !(End_timing === "End_time") || extra.length > 0) {
              res.end("Only What_do_you_want, Start_time, End_time allowed")
              console.log("Only What_do_you_want, Start_time, End_time allowed")
            }
            else {
              await result.updateOne({ _id: userId},{$set:data})
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end("Data updated successfully");
              console.log("data updated succesfully");
            }




          }
          catch (error) {
            console.error('Error retrieving data:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          }
        });

      }
      update_data()


    }
    else {
      res.end("Go to postman for update  todo list Data ")
    }

  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Rooute is not correct');
  }


});
const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});