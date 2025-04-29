import { useEffect,useState } from 'react';
import { Button, EditableText ,InputGroup,Toaster} from '@blueprintjs/core';
import './index.css';

const AppToaster =Toaster.create({
  position:"top"
})
function App() {
  const [users, setUsers]= useState([]);
  const [newName, setNewName]= useState("")
  const [newEmail, setNewEmail]= useState("")
  const [newWebsite, setNewWebsite]= useState("")


  useEffect (()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response)=> response.json())
    .then((json)=>setUsers(json))
  },[])

  function addUser(){
    const name=newName.trim();
    const email=newEmail.trim();
    const website=newWebsite.trim();

    if (name  && email && website){
    fetch("https://jsonplaceholder.typicode.com/users",
    {
      method:"POST",
      body:JSON.stringify({
        name,
        email,
        website

      }),
      headers:{
        "content-Type":"application/json; charset=UTF-8 "
      }
    }
  ).then((response)=> response.json())
  .then(data=>{
    setUsers([...users,data])
    AppToaster.show({
      message:"user Added sucessfully",
      intent:'success',
      timeout:4000
    })
    setNewName("");
    setNewEmail("");
    setNewWebsite("");


  })
  }
  }
  function onChangeHandler(id,key,value){
    setUsers((users)=>{
       return users.map(user=>{
        return user.id===id?{...user,[key]:value}:user;
      })
    })
  }

  function updateUser(id) {
    // Assume `users` is a state variable or a properly defined array
    const user = users.find((user) => user.id === id); // Correctly access `users`

    if (!user) {
        console.error("User not found");
        return;
    }

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            setUsers((prevUsers) =>
                prevUsers.map((u) => (u.id === id ? data : u))
            ); // Update the user in the state array
            AppToaster.show({
                message: "User updated successfully",
                intent: "success",
                timeout: 4000,
            });
        })
        .catch((error) => {
            console.error("Error updating user:", error);
        });
}


function deleteUser(id) {
  // Make a DELETE request to the API
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
  })
      .then((response) => {
          if (!response.ok) {
              throw new Error("Failed to delete the user");
          }
          // Update the state to remove the deleted user
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
          AppToaster.show({
              message: "User deleted successfully",
              intent: "success",
              timeout: 4000,
          });
      })
      .catch((error) => {
          console.error("Error deleting user:", error);
      });
}




  return (
    <div className="App">
      <table>
        <thead>
          <th>id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Action</th>
        </thead>
        <tbody>
          {users.map(user=>
          <tr key={user.id}>
            <td>  {user.id}</td>
            <td>  {user.name}</td>
            <td> <EditableText  onChange={value=>onChangeHandler(user.id,'email',value)} value={user.email}/> </td>
            <td>  <EditableText onChange={value=>onChangeHandler(user.id,'website',value)} value={user.website}/></td>
            <td>
              <Button intent='primary 'onClick={()=>updateUser(user.id)}>update</Button>
            <Button intent='danger' onClick={()=>deleteUser(user.id)}>delete</Button></td>
          </tr>
          )}
        </tbody>
        <tfoot>
          
          <tr>
            <td></td>
            <td><InputGroup
            value={newName}
            onChange={(e)=>setNewName(e.target.value)}
            placeholder='Enter website...'
            />
            
            </td>
            <td><InputGroup
            value={newEmail}
            onChange={(e)=>setNewEmail(e.target.value)}
            placeholder='Enter Email...'
            />
            
            </td>
            <td><InputGroup
            value={newWebsite}
            onChange={(e)=> setNewWebsite(e.target.value)}
            placeholder='Enter website...'
            />
            </td>
             
            <td>
                  <Button intent='success' onClick={addUser}> Add user</Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
