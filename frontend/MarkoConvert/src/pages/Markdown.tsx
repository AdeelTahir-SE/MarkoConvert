import dropfile from "../assets/dropfile.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Markdown() {
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState<string>("");
  const [preview,setPreview]=useState<string>("");
  const [markdownfiles,setMarkdownfiles]=useState([]);
  const [checkedgrammer,setCheckedGrammer]=useState<string>();
  const navigate = useNavigate();

  // Get token from session storage on mount
  useEffect(() => {
    setToken(sessionStorage.getItem('token') || "");
  }, []);


  async function handleFilesPreview(fileId: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/protected/note?id=${encodeURIComponent(fileId)}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
setPreview(await response.text());
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("File data:", data);
      // Handle the data (e.g., update state or display it)
    } catch (error) {
      console.error("Error fetching file data:", error);
    }
  }
  
  // Handle file drop
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
      alert(`Dropped file: ${droppedFiles[0].name}`);
    }
  }

  // Allow dragging over the drop area
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Preview the markdown (GET request)
  async function handlePreview() {
    try {
      // Ensure file is not null
      if (!file) {
        console.error("No file selected");
        return;
      }
  
     
  
      const response = await fetch("http://localhost:3000/api/protected/note", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  if(response){
    const Response =await response.text()
    setPreview(Response as any);
  }
      const data = await response.text(); // Get response as HTML text (markdown converted)
      console.log(data);
    } catch (error) {
      console.error("Error previewing markdown:", error);
    }
  }
  // saved markdown files (GET request)
  async function handleFiles() {
    try {
      const response = await fetch("http://localhost:3000/api/protected/savednotes", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMarkdownfiles(data)
      console.log(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }

  // Save the markdown file (POST request with file upload)
  async function handleSave() {
    if (!file) {
      alert("Please drop a markdown file first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file",file);

      const response = await fetch("http://localhost:3000/api/protected/savenote", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert("Markdown saved successfully!");
        navigate("/Markdown");
      } else {
        alert("Failed to save markdown.");
      }
    } catch (error) {
      console.error("Error saving markdown:", error);
    }
  }

  // Grammar check (GET request)
  async function handleCheck() {
    try {
      const response = await fetch("http://localhost:3000/api/protected/grammercheck", {
        method:"POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body:await readFileAsText(file)
      });
      const data = await response.text(); // Assuming it's just HTML or text
      setCheckedGrammer(data);
      console.log(data);
    } catch (error) {
      console.error("Error checking grammar:", error);
    }
  }
  function readFileAsText(file: File|null): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      reader.readAsText(file as File, 'utf-8');

    });
  }
  return (
    <div className="flex flex-col justify-center items-center w-full">
    <h1 className="text-3xl text-center">Mark Down Notes</h1>
    <div
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  className="flex flex-col justify-around items-center p-4 hover:scale-110 transition-all min-w-96 cursor-pointer w-full"
>
  <div className="draganddrop border-2 rounded-lg border-black bg-slate-100 shadow-2xl min-w-[600px] min-h-[224px] flex justify-center items-center">
    <div className="flex flex-col border-dashed border-2 border-gray-400 p-4 w-full h-full items-center justify-center">
      <img
        className="w-12 h-auto mb-2"  
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
            {/* Markdown Preview */}
            <div className="w-1/5 h-auto p-4 shadow-lg flex flex-col bg-gray-100">
              <h1 className="text-2xl font-bold">Markdown-Preview</h1>
              <p className="text-gray-700">Preview Your markdown code</p>
              <button className="bg-gray-600 text-white p-2 hover:bg-gray-400 rounded-lg mt-4" onClick={handlePreview}>
                Preview
              </button>
            </div>

            {/* Markdown Save */}
            <div className="w-1/5 h-auto p-4 shadow-lg flex flex-col bg-gray-100">
              <h1 className="text-2xl font-bold">Markdown-save</h1>
              <p className="text-gray-700">Save your markdown file</p>
              <button className="bg-gray-600 text-white p-2 hover:bg-gray-400 rounded-lg mt-4" onClick={handleSave}>
                Save
              </button>
            </div>

            {/* Markdown Files */}
            <div className="w-1/5 h-auto p-4 shadow-lg flex flex-col bg-gray-100">
              <h1 className="text-2xl font-bold">Markdown-files</h1>
              <p className="text-gray-700">See your markdown files</p>
              <button className="bg-gray-600 text-white p-2 hover:bg-gray-400 rounded-lg mt-4" onClick={handleFiles}>
                Markdown files
              </button>
            </div>

            {/* Grammar Check */}
            <div className="w-1/5 h-auto p-4 shadow-lg flex flex-col bg-gray-100">
              <h1 className="text-2xl font-bold">Markdown-grammer</h1>
              <p className="text-gray-700">Check grammar of markdown</p>
              <button className="bg-gray-600 text-white p-2 hover:bg-gray-400 rounded-lg mt-4" onClick={handleCheck}>
                Check
              </button>
            </div>
          </div>

      
          {preview ? (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-4">
          <h2 className="text-2xl font-bold mb-4">Markdown Preview</h2>
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-4">
          <h2 className="text-2xl font-bold mb-4">Markdown Preview</h2>
          <p className="text-gray-700">No markdown to preview</p>
          </div>
      )}
         {markdownfiles && markdownfiles.length > 0 ? (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-4">
          <h2 className="text-2xl font-bold mb-4">Markdown Files</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-5 space-y-2">
              {markdownfiles.map((file:any) => (
                <li key={file.id} className="text-gray-800">
                  <div className="font-bold">ID: {file.id}</div>
                  <div className="mt-1">Content: {file.content}</div>
                  <div className="text-sm text-gray-500">
                    Created At: {file.createdAt} | Updated At: {file.updatedAt}
                  </div>
                  <button className="bg-gray-100 rounded shadow-lg p-2" onClick={()=>{handleFilesPreview(file.id)}}>Preview</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-4">
          <h2 className="text-2xl font-bold mb-4">Markdown Files</h2>
          <p className="text-gray-700">No markdown files to display</p>
        </div>
      )}

{checkedgrammer ? (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-4">
          <h2 className="text-2xl font-bold mb-4">Grammar Check Results</h2>
          <p>{checkedgrammer}</p>
        </div>
      ):(
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-4">
          <h2 className="text-2xl font-bold mb-4">Grammar Check Results</h2>
          <p className="text-gray-700">No grammar check results</p>
        </div>
      )}    </div>

  );
}