// const check = document.body.getElementById("notesCheck")
// if(check.checked){
const btnId = document.getElementById("btnId")
chrome.storage.sync.get("set",(obj)=>{
  
  console.log(obj)
  if(obj.set)
  {
    btnId.style.backgroundColor = "green"
  }
  else{
    btnId.style.backgroundColor = "red"
  }
})


btnId.addEventListener("click",()=>{
  chrome.storage.sync.get("set",(obj)=>{
    if(obj.set){
      chrome.storage.sync.set({ "set":false }, () => { 
        btnId.style.backgroundColor = "red"
        chrome.runtime.sendMessage({type:"FROM_POPUP",value:false});
      })
    }
    else{
      chrome.storage.sync.set({ "set":true }, () => { 
        btnId.style.backgroundColor = "green"
        chrome.runtime.sendMessage({type:"FROM_POPUP",value:true});
      })
    }

  })
  })
  

