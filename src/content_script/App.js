/*global chrome*/
import { useState,useEffect } from 'react';
import { ShadowRoot } from './ShadowRoot';
// import IMG from "../../images/threeDots.jpg"
import $ from "jquery";
import "jquery-ui-dist/jquery-ui"
import './App.css';
 
const threeDots = {
    width: "45px",
    height: "45px",
    borderImage: "none",
    border: "1px solid lightseagreen",
    borderRadius: "39%",
    top: "60%",
    position: "fixed",
    marginLeft: "48vw",
    cursor:"pointer",
    zIndex:"2147483647"

}

const upArrow = {
  width: "2em",
  height: "2em",
  borderImage: "none",
  border: "1px solid lightseagreen",
  borderRadius: "39%",
  top: "64%",
  position: "fixed",
  marginLeft: "94vw",
  cursor:"pointer",
  zIndex:"2147483647"
}

const innerDivNotActive = {
  display:"flex",
  flexDirection:"column",
  marginLeft:"30px",
  backgroundColor: "blanchedalmond",
  alignItems:"center",
  marginBottom:"10px",
  width:"175px",
  height:"146px",
  borderRadius:"15px"
  
}

const Icon = {
  marginTop: "-7%",
  marginLeft: "98%",
  backgroundColor: "white",
  borderRadius: "50%",
  width:"32px"
}

const innerDivActive = {
  display:"flex",
  flexDirection:"column",
  marginLeft:"30px",
  backgroundColor: "yellowgreen",
  alignItems:"center",
  marginBottom:"10px",
  width:"175px",
  height:"146px",
  borderRadius:"15px"
  
}

const Image = {
  width:"160px",
  height:"100px",
  objectFit:"cover",
  borderRadius: "9px",
  marginBottom: "11px"


}

const Anchor = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "inherit",
  height: "inherit",
  textDecoration:"none"
}

const Header1 = {
  color:"blue",
  fontSize:"11.8px",
  whiteSpace:"nowrap"
}

function App() {
  console.log("app")
  // const h= document.getElementById("insertion-point").firstChild.shadowRoot
  const [url, seturl] = useState([])
  const [mouseMove, setmouseMove] = useState(false)




  useEffect(()=>{
    const currentTimeInSeconds=Math.floor(Date.now()/1000); 
    const x = window.location.href
    const h= document.getElementById("insertion-point").firstChild.shadowRoot

    h.innerHTML = `<style>
      .hides{
        background-color:black;
        width:175px;
        margin-left:30px;
        display: none;
        font-size: 12.5px;
        text-align: center;
        color: white;
        border-radius: 10px;
        padding-top: 2px;
        padding-bottom: 2px;
      }
      #second:hover .hides{
        display:block;
      }
      .megaDiv{
        display:none;
      }
      #upArrow{
        display:none;
      }
      #gigaDiv:hover .megaDiv{
        display:flex !important;
      }
      #gigaDiv:hover #threeDots{
        filter: grayscale(100%);
      }
      #upArrow:hover{
        font-size:1.2em;
        filter: drop-shadow(8px 8px 10px gray);
      }
    </style>`
    console.log("Title",document.title)
   
    chrome.storage.sync.get("set",(obj)=>{
      if(obj.set){
        chrome.runtime.sendMessage({type:"FROM_CONTENT_TRUE"})
      }
      else{
        console.log("Not working set in content script")
      }
    })
    chrome.runtime.onMessage.addListener(msgObj => {
      console.log("In ContentScript",msgObj)
    if(msgObj.type === "FROM_BACKGROUND_TRUE")
    {  
    chrome.storage.local.get("lru",(obj)=>{
      console.log("OBJECT",obj)
      if(Object.keys(obj).length === 0){
        chrome.storage.local.set({"lru":{[x] : [currentTimeInSeconds,msgObj.dataurl,document.title,msgObj.iconurl]}}, function() { 
          console.log("Object saved for the first time")
        })
      }
      else{
        obj.lru[x] = [currentTimeInSeconds,msgObj.dataurl,document.title,msgObj.iconurl]
        chrome.storage.local.set(obj, function() { 
          console.log("Object not saved for the first time")
        })
      }  
  
    chrome.storage.local.get("lru", function(items) {
      var pairs=[]
     
      var allKeys = Object.keys(items.lru);
      console.log(allKeys);
      console.log(items.lru);
      const map = new Map()
      for(var key in items.lru){
        map.set(key,[items.lru[key][0],items.lru[key][1],items.lru[key][2],items.lru[key][3]]);
        
      }

      const mapSort2 = new Map([...map.entries()].sort((a, b) => a[1][0] - b[1][0]));
      console.log("Map"+map)
      console.log("sortedMap",mapSort2)
      for (const [key, value] of mapSort2.entries()) {
        console.log(key, value);
      }
      if(mapSort2.size>5){
        while(mapSort2.size!=5){
        chrome.storage.sync.remove(mapSort2.keys().next().value)
        allKeys = allKeys.filter((val)=> val!=mapSort2.keys().next().value)
        mapSort2.delete(mapSort2.keys().next().value)
        pairs = pairs.filter((val)=> val.url!=mapSort2.keys().next().value)
        }
      }
      const mapSort3 = new Map([...mapSort2.entries()].sort((a, b) => b[1][0] - a[1][0]));
      for(const [key, value] of mapSort3.entries()){
        pairs.push({"url":key,"image":value[1],"title":value[2],"icon":value[3]})
      }
      const maindiv = h.getElementById("mainDiv")
      maindiv.style.display = "flex"
      console.log("pairs",pairs)
      seturl(pairs)

      
  });
});
}
else if(msgObj.type === "FROM_BACKGROUND_FALSE"){
  console.log("DONT_SHOW")

    chrome.storage.local.set({"lru":{}}, function() { 
      console.log("Object saved for the first time")
    })
  

  const maindiv = h.getElementById("mainDiv")
  maindiv.style.display = "none"
}
});
  },[])

  useEffect(()=>{
    const h= document.getElementById("insertion-point").firstChild.shadowRoot


      const e = h.getElementById("gigaDiv")
      if(e){
        console.log(e)
        const x = e.getElementsByTagName("img")[1]
        if(x){
          console.log(x)
          $(x).draggable({ axis: "x" });
        }
      }
    


  },[mouseMove])
  function MouseClick(event){
    const h= document.getElementById("insertion-point").firstChild.shadowRoot
    const e = h.getElementById("gigaDiv")
    const upArrow = e.getElementsByTagName("img")[0]
    // const threeDots = e.getElementsByTagName("img")[1]
    const megaDiv = e.getElementsByTagName("div")[0]
    megaDiv.style.display = "flex"
    // threeDots.style.display = "none"
    upArrow.style.display = "flex"
    event.target.style.display = "none"
      // event.target.previousElementSibling.style.display = "flex"
      // 
      // event.target.nextElementSibling.style.display = "flex"
  }
  function MouseClick2(event){
    const h= document.getElementById("insertion-point").firstChild.shadowRoot
    const e = h.getElementById("gigaDiv")
    const megaDiv = e.getElementsByTagName("div")[0]
    const threeDots = e.getElementsByClassName("threeDots")[0]
    console.log(megaDiv)
    threeDots.style.display = "flex"
    megaDiv.style.display = "none"
    event.target.style.display = "none"
    
    // event.target.nextElementSibling.style.display = "flex"
    // event.target.nextElementSibling.nextElementSibling.style.display = "none"
    
  }
  function MouseMove(event){
    if(!mouseMove){
      setmouseMove(true)
    }
  }
  return (
    <ShadowRoot>
      <div className="App">
        <div id="gigaDiv">
        {/* <img id ="upArrow" style={threeDots} onClick={MouseClick2}  src="https://cdn-icons-png.flaticon.com/512/892/892692.png" alt="#" /> */}
        <img id ="upArrow" style={upArrow} onClick={MouseClick2}  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH5ZlhdkZ8iYNw_2Y8wvXY20nteFyyX8F21BqzzbYLq_MM5xfe5BNwgPNKbgRmzMrVlWE&usqp=CAU" alt="#" />
        <img id="threeDots" class="threeDots" style={threeDots} onClick={MouseClick} onMouseMove={MouseMove} src="https://thumbs.dreamstime.com/b/three-dots-icon-three-dots-icon-sign-symbol-vector-illustration-icon-108251358.jpg" alt="#" />
        <div class = "megaDiv">
        
        <div id="mainDiv" style={{position:"fixed",marginRight:"30px",top:"70%",justifyContent:"center",zIndex:"99999",display:"flex",width:"100vw",fontFamily:"NONE"}}>
        {
      
          url.map((u,index)=>{
            return <div id="second" style={{display:"flex",flexDirection:"column"}}><div class='hides'>{(u.url).length>27 ? (u.url).slice(0,27) + "..." : u.url}</div><div style={u.url===window.location.href ? innerDivActive : innerDivNotActive}><a style ={Anchor} href={u.url}><h1 key ={index} style={Header1}>{(u.title).length>27 ? (u.title).slice(0,27) + "..." : u.title}</h1> <img style={Image} src={u.image} alt={"https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}/></a><img style={Icon} src={u.icon}></img></div></div>
          })
        }
        </div>
        </div>
        </div>
      </div>
    </ShadowRoot>
  );
}

export default App;

