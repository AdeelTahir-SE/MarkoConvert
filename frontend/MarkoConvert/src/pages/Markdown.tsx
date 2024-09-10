import dropfile from "../assets/dropfile.svg";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Markdown() {
  const [file, setFile] = useState<File | null>(null);
  const [token,setToken]=useState("");
  useEffect(()=>{
      setToken(sessionStorage.getItem('token') || "");
  },[]);
const navigate =useNavigate();
  // Handle the drop event
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
      console.log(droppedFiles[0]);
      alert(`Dropped file: ${droppedFiles[0].name}`);
    }
  }

  // Handle the drag over event to allow dropping
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault(); // Prevent default behavior to allow drop
    e.stopPropagation(); // Stop event from bubbling up
  }


  async function handlePreview(){
    const response =await fetch("http://localhost:3000/api/protected/note",{
      
      headers:{
        "Authorization":`Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(data);
  }
  async function handleFiles(){
    const response =await fetch("http://localhost:3000/api/protected/savednotes",{
      
      headers:{
        "Authorization":`Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(data);
  }
  async function handleSave(){
    const response =await fetch("http://localhost:3000/api/protected/savenote",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`

      },
      body:JSON.stringify(file)
    });
    const data = await response.json();
    console.log(data);
    if(response){
      navigate("/Markdown")
  }
  }
  async function handleCheck(){
    const response =await fetch("http://localhost:3000/api/protected/grammer",{
      
      headers:{
        "Authorization":`Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(data);
  }
  return (
    <div className="flex flex-col">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver} // Allow drop by preventing default behavior
        className="flex flex-col justify-around items-center p-4 hover:scale-110 transition-all min-w-64 cursor-pointer"
      >
        <div className="draganddrop border-2 rounded-lg border-black bg-slate-100 shadow-2xl min-w-[224px] min-h-[224px] flex justify-center items-center">
          <div className="flex flex-col border-dashed border-2 border-gray-400 p-4 w-full h-full items-center justify-center">
            <img
              className="w-16 h-16 mb-2"
              src={dropfile}
              alt="Drop file icon"
            />
            <p className="text-gray-700">
              {file ? file.name : "Drag and drop your markdown file here"}
            </p>
          </div>
        </div>
      </div>
      <div className="options flex flex-row justify-around items-center mt-4">
        <div className="w-1/5 h-auto p-4 shadow-lg  flex flex-col bg-gray-100">
          <h1 className="text-2xl font-bold">Markdown-Preview</h1>
          <p className="text-gray-700">Preview Your markdown code</p>
          <button className="bg-gray-600 text-white p-2 hover:bg-gray-400 rounded-lg mt-4" onClick={handlePreview}>
            Preview
          </button>
        </div>
        <div className="w-1/5 h-auto p-4 shadow-lg  flex flex-col bg-gray-100">
          <h1 className="text-2xl font-bold">Markdown-save</h1>
          <p className="text-gray-700">Save your markdown file</p>
          <button className="bg-gray-600 text-white p-2 hover:bg-gray-400 rounded-lg mt-4" onClick={handleSave}>
            Save
          </button>
        </div>
        <div className="w-1/5 h-auto p-4 shadow-lg  flex flex-col bg-gray-100">
          <h1 className="text-2xl font-bold">Markdown-files</h1>
          <p className="text-gray-700">See your markedown files</p>
          <button className="bg-gray-600 text-white p-2 hover:bg-gray-400 rounded-lg mt-4" onClick={handleFiles}>
            Markdown files
          </button>
        </div>
        <div className="w-1/5 h-auto p-4 shadow-lg  flex flex-col bg-gray-100">
          <h1 className="text-2xl font-bold">Markdown-grammer</h1>
          <p className="text-gray-700">Check grammer of markdown</p>
          <button className="bg-gray-600 text-white p-2 hover:bg-gray-400 rounded-lg mt-4" onClick={handleCheck}>
            Check
          </button>
        </div>
      </div>
    </div>
  );
}
