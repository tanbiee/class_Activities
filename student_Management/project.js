import express from 'express'
import fs from 'fs'


const app = express();
app.use(express.json());

app.get('/', (req, res)=>{
    res.send(`this is the page`);
})

//get all info of the user
app.get('/students', (req, res)=>{
    let info;
    fs.readFile('info.json', 'utf-8', (err, data)=>{
        if(err){
            res.json({message: "error in reading the file"});
            return;
        }
        info = JSON.parse(data);
        res.send(info);
    })
})

//update user by given id using put
app.put('/students/:id', (req, res)=>{
    const {id} = req.params;
    const {name, email, couse} = req.body;
    
    fs.readFile('info.json', 'utf-8', (err, data)=>{
        if(err){
            res.status(500).json({message: "error in Reading file"});
            return;
        }
        const info = JSON.parse(data);
        const index = info.findIndex(u=> u.id===id);
        if(index===-1){
            res.send(`Id doesn't exist`);
        }
        info[index].name = name;
        info[index].email = email;
        info[index].course = couse;


        fs.writeFile('info.json', JSON.stringify(info, null, 2), (err)=>{
            if(err){
                res.status(500).json({message: "error in writing the file"});
                return;
            }
            res.json({message: "updated Successfully"});
        })
    })

})

//delte the user from the array by given id 
app.delete('/students/:id', (req, res)=>{
    const {id} = req.params;
    let newInfo;
    fs.readFile('info.json', 'utf-8', (err, data)=>{
        if(err){
            res.status(501).json({message: "error in reading the file"});
            return;
        }
        const info = JSON.parse(data);
        newInfo = info.filter(u=>u.id!==id);

        fs.writeFile('info.json', JSON.stringify(newInfo, null, 2), (err)=>{
        if(err){
            res.status(501).json({message: "error in writing the updated file"});
            return;
        }
        res.send('done delteting the data ')
    })
        
    })
    
})

//get user by id
app.get('/students/:id', (req, res)=>{
    
    const { id } = req.params;
    fs.readFile('info.json', 'utf-8', (err, data)=>{
        if(err){
            console.log(err);
            return;
        }
        const users = JSON.parse(data);
        const user = users.find(u=> u.id==id);
        if(!user){
            console.log(`not found`);
        }
        res.send(user);
    })
    

})

//add user info 
app.post('/students', (req, res)=>{
    const {id, name, email, course} = req.body;

    console.log(`id: ${id} name: ${name} email: ${email} course: ${course}`);
    fs.readFile('info.json', 'utf-8', (err, data)=>{
        const user = {
            id, 
            name, 
            email, 
            course
        }
        let info=[];
        if (err) {
            if (err.code !== 'ENOENT') {
                return res.status(500).json({ message: 'Error reading file' });
            }
        } else {
            try {
                info = JSON.parse(data);
                if (!Array.isArray(info)) {
                    info = [];
                }
            } catch {
                info = [];
            }
        }
        
        
        
        info.push(user);
    
        fs.writeFile('info.json', JSON.stringify(info, null, 2), (err)=>{
            if(err){
                console.log(err);
                return;
            }
            
            res.send(`done`);
        });
    })

    



})



app.listen(3000, ()=>{
    console.log(`server is running on http://localhost:3000`);
})