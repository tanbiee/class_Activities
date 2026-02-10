import fs from 'fs';


//get all the complaints that are stored in the file name complaints.json
export const getComplaints =(req, res)=>{
    fs.readFile('complaints.json', 'utf-8', (err, data)=>{
        if(err){
            res.status(404).json({message: `Error reading complaints file ${err.message}`});
            return;
        }
        const complaint = JSON.parse(data);
        res.send(complaint);
    })
}

// post the complaints and the complaints will be saved in the complaints.json
export const postComplaints = (req, res)=>{
    const {name, email, title, description} = req.body;
    if(!name || !email || !title || !description){
        res.status(400).json({message: `name, email, title, description are required`});
        return;
    }
    
    
    fs.readFile('complaints.json', 'utf-8', (err, data)=>{
        let complaints = [];
         if(!err){
            try{
                complaints = JSON.parse(data);
                if(!Array.isArray(complaints)){
                    complaints=[];
                }
            }catch(e){
                complaints=[];
            }
        }
        const lastId = complaints.length > 0 
                    ? Math.max(...complaints.map(c => c.id))
                    : 1;
        const complaint = {
            id: lastId+1,
            name,
            email,
            title,
            description,
            status: 'pending',
        }
        
        complaints.push(complaint);
        fs.writeFile('complaints.json', JSON.stringify(complaints, null, 2), (err)=>{
            if(err){
                res.status(500).json({message: `error in writing file`});
                return;
            }
            res.status(201).json({
                message: "Complaint submitted successfully",
                complaint
            });


        })
    })
}

//get complaints by id
export const getComplaintById = (req, res)=>{
    const id = Number(req.params.id);
    fs.readFile('complaints.json', 'utf-8', (err, data)=>{
        if(err){
            res.status(400).json({message: `Error in reading the file`});
            return;
        }
        const complaint = JSON.parse(data);
        const complaint_idx = complaint.findIndex(u=>u.id === id);
        if(complaint_idx === -1){
            res.status(404).json({message: `complaint with id ${id} not found`});
            return;
        }
        res.send(complaint[complaint_idx]);
    })
}

export const putComplaints = (req, res)=>{
    const  id  = Number(req.params.id);
    const { status } = req.body;

   fs.readFile('complaints.json', 'utf-8', (err, data)=>{
    if(err){
        res.status(404).json({message: `Error reading complaints file ${err.message}`});
        return;
    }
    const complaints = JSON.parse(data);
    const complaintIndex = complaints.findIndex(c=>Number(c.id) ===id);
    if(complaintIndex === -1){
        res.status(404).json({message: `complaint with id ${id} not found`});
        return;
    }
    complaints[complaintIndex].status = status;
    fs.writeFile('complaints.json', JSON.stringify(complaints, null, 2), (err)=>{
        if(err){
            res.status(500).json({message: `Error writing complaints file ${err.message}`});
            return;
        }
        res.status(200).json({message: `complaint with id ${id} updated successfully`});

    })

   }) 

}

export const deleteComplaint = (req, res)=>{
    const id = Number(req.params.id);
    fs.readFile('complaints.json', 'utf-8', (err, data)=>{
        if(err){
            res.status(404).json({message: `Error reading complaints file ${err.message}`});
            return;
        }
        const complaints = JSON.parse(data);
        const newComplaints = complaints.filter(u=>Number(u.id) !== id);
        if(newComplaints.length === complaints.length){
            res.status(404).json({message: `complaint with id ${id} not found`});
            return;
        }
        fs.writeFile('complaints.json', JSON.stringify(newComplaints, null, 2), err=>{
            if(err){
                res.status(500).json({message: `Error writing complaints file ${err.message}`});
                return;
            }
            res.status(200).json({message: `complaint with id ${id} deleted successfully`});
        })

    })
    
    
}

export const getComplaintsStats = (req, res)=>{
    fs.readFile('complaints.json', 'utf-8', (err, data)=>{
        if(err){
            res.status(404).json({message: `Error reading complaints file ${err.message}`});
            return;
        }
        const complaints = JSON.parse(data);
        const totalComplaints = complaints.length;

        const stats = {
            total: totalComplaints,
            pending: complaints.filter(c=>c.status ==='pending').length,
            resolved: complaints.filter(c=>c.status ==='resolved').length,
            rejected: complaints.filter(c=>c.status ==='rejected').length,
        }
        res.json(stats);
        
        
    })
}