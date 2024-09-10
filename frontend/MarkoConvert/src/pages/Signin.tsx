import { useNavigate } from "react-router-dom";
export default function SignIn() {
const navigate =useNavigate()
    async function handleSubmit(e:any){
        e.preventDefault();
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const password = (document.getElementById("password")as HTMLInputElement).value;
        const response =await fetch("http://localhost:3000/api/user/signin",{
            method:"POST",
            headers:{
            "Content-Type":"application/json"
            },
            body:JSON.stringify({email,password})
        });
        const data = await response.json();
        console.log(data);
        sessionStorage.setItem('token', data.token);
        if(response){
            navigate("/Markdown")
        }
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-200">
        <div className="bg-white text-center rounded-lg shadow-lg p-10 w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-purple-600">Sign In</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-start">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-purple-500 rounded-lg focus:outline-none focus:border-purple-600"
              />
            </div>
  
            <div className="flex flex-col items-start">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-purple-500 rounded-lg focus:outline-none focus:border-purple-600"
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300"
            >
              Sign In
            </button>
          </form>
  
          <p className="mt-6 text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Create Account
            </a>
          </p>
        </div>
      </div>
    );
  }
  