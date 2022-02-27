
//checking if domain filter is on/off
const domain = document.getElementById("domain")
const hidden = document.getElementById("hidden")
domain.addEventListener("click",()=>{
  if(domain.checked){
    hidden.style.display = "block"
  }
  else{
    hidden.style.display = "none"
  }

})

//for the first p tag(first domain)
document.getElementsByTagName("i")[0].addEventListener("click",function(){
      this.parentNode.remove()
  })
//for adding remaining p tags(remaining domains)  
  const addBtn = document.getElementById("addBtn")
  addBtn.addEventListener("click",()=>{
    const p = document.createElement("p")
    const input = document. createElement("input"); 
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Add Domain');
    const i = document. createElement("i"); 
    i.classList.add("fa","fa-window-close")
    i.addEventListener("click",function(){
      this.parentNode.remove()
    })
    p.appendChild(input)
    p.appendChild(i)
    
    hidden.insertBefore(p,addBtn)


  })
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
        // chrome.runtime.sendMessage({type:"FROM_POPUP",value:true});
        chrome.tabs.query( {
          // gets the window the user can currently see
          active: true, 
          currentWindow: true 
          },function(tabs){
          chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT,
          function(dataurl){
              console.log("POPup",dataurl)
              console.log("tabs",tabs[0])
              //   chrome.tabs.sendMessage(tabs[0].id,dataurl);
              // chrome.processes.getProcessIdForTab(tabs[0].id,(processId)=>{
              //     console.log(processId)
              // })
              chrome.tabs.sendMessage(tabs[0].id,{type:"FROM_BACKGROUND_TRUE",dataurl:dataurl,iconurl:tabs[0].favIconUrl});
          
          })
          })
      })
    }

  })
  })
  

