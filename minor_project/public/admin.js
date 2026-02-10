
    
    const totalComplaints = document.getElementById('total');
    const pendingComplaints = document.getElementById('pending');
    const resolvedComplaints = document.getElementById('resolved');
    const rejectedComplaints = document.getElementById('rejected');
    document.getElementById('searchInput').addEventListener('input', applyFilters);

    // Fetch complaint data from the server
    fetch('/complaints/stats')
    .then(response => response.json())
    .then(data=>{
        totalComplaints.textContent = `Total Complaints: ${data.total}`;
        pendingComplaints.textContent = `Pending: ${data.pending}`;
        resolvedComplaints.textContent = `Resolved: ${data.resolved}`;
        rejectedComplaints.textContent = `Rejected: ${data.rejected}`;
    })
    .catch(error => console.error('Error fetching complaints:', error));

    const list = document.getElementById('list_complaints');
  
    
    let allComplaints = [];
    let activeStatus = 'all';
    fetch('/complaints')
    .then(res=>res.json())
    .then(data=>{
        allComplaints = data;
        applyFilters();
    })
    .catch(err=>console.log(err));


    function updateStatus(id, status){
        fetch(`/complaints/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({status})
        })
        .then(res=>{
            if(!res.ok){
                throw new Error('Failed to update status');
            }
        })
        .catch(err=>console.log(err));

    }
    function filterByStatus(status){
        activeStatus = status;
        applyFilters();
        

    }

    function renderComplaints(complaints){
        list.innerHTML="";
        complaints.forEach(c=>{
            const li = document.createElement("li");
            li.classList.add(`complaint-item`);
            
            li.innerHTML = `
                <h5><b>Complaint ID: </b>${c.id}</h5>
                <h3><b>User: </b>${c.name}</h3>
                <p><b>Title: </b>${c.title}</p>
                <p><b>Description: </b>${c.description}</p>
                <p><b>Status: </b>${c.status}</p>
                `;

            const select = document.createElement("select");

            ['pending', 'resolved', 'rejected'].forEach(status=>{
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                if(c.status === status){
                    option.selected = true;
                }
                select.appendChild(option);
            })
            select.addEventListener('change', ()=>{
                updateStatus(c.id, select.value);
                c.status = select.value;
                applyFilters();
                location.reload();
            })

            const btn = document.createElement("button");
            btn.textContent = "Delete";
            btn.addEventListener('click', ()=>deleteComplaint(c.id));

            li.append(select, btn);
            list.appendChild(li);

        })
    }
    function deleteComplaint(id){
        fetch(`/complaints/${id}`, {
            method: `DELETE`
        })
        .then(res=>{
            if(!res.ok){
                throw new Error('Failed to delete complaint');
            }
            allComplaints = allComplaints.filter(c=>c.id !== id);
            applyFilters();
            location.reload();
        })
        .catch(err=>console.log(err));

        
    }

    function applyFilters(){
        const searchItem = document
            .getElementById('searchInput')
            .value.toLowerCase()
            .trim();

        let result = allComplaints;
        if(activeStatus !== 'all'){
            result = result.filter(c=>c.status === activeStatus);
        }
        if(searchItem){
            result = result.filter(c =>
        String(c.id).includes(searchItem) ||
        (c.name || "").toLowerCase().includes(searchItem) ||
        (c.title || "").toLowerCase().includes(searchItem) ||
        (c.description || "").toLowerCase().includes(searchItem)
    );
        }
        renderComplaints(result);
    }

    //nodeJS lib that make it async libUV written in C.
