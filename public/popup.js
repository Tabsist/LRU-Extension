
//checking if domain filter is on/off
const domain = document.getElementById("domain")
const hidden = document.getElementById("hidden")

const domainCheck = ()=>{
  if(domain.checked){
    hidden.style.display = "block"
    chrome.storage.sync.set({ "checkbox":true }, () => { 
        console.log("checked")
    })
  }
  else{
    hidden.style.display = "none"
    chrome.storage.sync.set({ "checkbox":false }, () => { 
      console.log("unchecked")
      chrome.storage.sync.set({ "domainList": [] }, () => { 
        console.log("Emptied Domains")
        const li = hidden.getElementsByTagName("p")
        console.log(li)
        const x = li.length
        for(j=x-1;j>=0;j--){
          console.log(li[j])
          li[j].remove()
        }
      })
  })
  }
}

chrome.storage.sync.get("checkbox", (obj) => { 
  if(obj){
    if(obj.checkbox){
      hidden.style.display = "block"
      domain.checked = true
      chrome.storage.sync.get("domainList", (obj) => { 
        console.log("Domainlist",obj)
        if(obj){
          if(obj.domainList){
            hidden.firstElementChild.remove()
            for(j=0;j<obj.domainList.length;j++){
              if(obj.domainList[j] != ""){
                console.log("asdsda",obj.domainList[j] )
                const p = document.createElement("p")
                const input = document. createElement("input"); 
                input.setAttribute('type', 'text');
                input.setAttribute('placeholder', 'Add Domain');
                const i = document. createElement("i"); 
                i.classList.add("fa","fa-window-close")
                i.addEventListener("click",function(){
                  this.parentNode.remove()
                })
                input.setAttribute('value', obj.domainList[j]);

                p.appendChild(input)
                p.appendChild(i)  
                hidden.insertBefore(p,filterBtns)
            }
            }
          }
        }
      })
    }
    else{
      hidden.style.display = "none"
      domain.checked = false
    }
  }
})

domain.addEventListener("click",()=>{
    domainCheck()
})

//for the first p tag(first domain)
document.getElementsByTagName("i")[0].addEventListener("click",function(){
      this.parentNode.remove()
  })
//for adding remaining p tags(remaining domains)  
  const addBtn = document.getElementById("addBtn")
  const filterBtns = document.getElementById("filterBtns")
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
    hidden.insertBefore(p,filterBtns)
  })
//for saving Domains
const saveBtn = document.getElementById("saveBtn")
  saveBtn.addEventListener("click",()=>{
    li = hidden.getElementsByTagName("input")
    const arr = []
    for(i=0;i<li.length;i++){
      if(li[i].value != ""){
        arr.push(li[i].value)
        chrome.storage.sync.set({ "domainList":arr }, () => { 
          console.log("Saved Domains")
        })
    }
  }
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
  

