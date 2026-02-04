import fs from 'fs';

let complaints = [];
//get all the complaints that are stored in the file name complaints.json
export const getComplaints =(req, res)=>{
    res.send(complaints);
}

// post the complaints and the complaints will be saved in the complaints.json
export const postComplaints = (req, res)=>{
    const {id, title, description, status} = req.body;
    const complaint = {
        id, title, description, status
    }
    complaints.push(complaint);
    res.status(201).json({message: `complaint added successfully`});
}

export const putComplaints = (req, res)=>{
    const  id  = Number(req.params.id);
    const { status } = req.body;

    const complaintIndex = complaints.findIndex(c=>Number(c.id) ===id);
        if(complaintIndex === -1){
            res.status(404).json({message: `complaint with id ${id} not found`});
            return;
        }
        complaints[complaintIndex].status = status;
        res.status(200).json({message: `complaint with id ${id} resolved successfully`});

}

export const deleteComplaint = (req, res)=>{
    const id = Number(req.params.id);
    const newComplaints = complaints.filter(u=>Number(u.id) !== id);
    complaints = newComplaints;
    res.status(200).json({message: `complaint with id ${id} deleted successfully`});
    
}