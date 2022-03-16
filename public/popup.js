//Creating Input Elements to take in domain
const createElements = ()=>{
  const p = document.createElement("p")
  const input = document. createElement("input"); 
  const i = document. createElement("i"); 
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'Add Domain');
  
  i.classList.add("fa","fa-window-close")
  i.addEventListener("click",function(){
    chrome.storage.local.get("lru",(items)=>{
      var allKeys = Object.keys(items.lru);
      const obj = items.lru
      console.log(items.lru.size)
      const removedDomainLink = this.parentNode.firstElementChild.value
      for(let j=0;j<allKeys.length;j++){
        if(allKeys[j].includes(removedDomainLink))
        {
          console.log("in i tag",obj[allKeys[j]])
          delete obj[allKeys[j]]
        }    
      }
      chrome.storage.local.set({"lru":obj}, function(returnedObj) { 
        console.log("LRU List Emptied",returnedObj)
        // chrome.runtime.sendMessage({type:"FROM_CONTENT_TRUE"})
        
      })
      this.parentNode.remove()
      
      allKeys = []
    })
    
  })
  

  p.appendChild(input)
  p.appendChild(i) 
  return p
}

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
  chrome.storage.local.set({"lru":{}}, function() { 
    console.log("LRU List Emptied")
    chrome.runtime.sendMessage({type:"FROM_CONTENT_TRUE"})
  })

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
                const p = createElements()
                p.firstChild.setAttribute('value', obj.domainList[j]); 
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
  chrome.storage.local.get("lru",(items)=>{
    var allKeys = Object.keys(items.lru);
    const obj = items.lru
    console.log(items.lru.size)
    const removedDomainLink = this.parentNode.firstElementChild.value
    for(let j=0;j<allKeys.length;j++){
      if(allKeys[j].includes(removedDomainLink))
      {
        console.log("in i tag",obj[allKeys[j]])
        delete obj[allKeys[j]]
      }    
    }
    chrome.storage.local.set({"lru":obj}, function(returnedObj) { 
      console.log("LRU List Emptied",returnedObj)
      
    })
    this.parentNode.remove()
    
    allKeys = []
  })
  })
//for adding remaining p tags(remaining domains)  
const addBtn = document.getElementById("addBtn")
const filterBtns = document.getElementById("filterBtns")
addBtn.addEventListener("click",()=>{
  const p = createElements() 
  hidden.insertBefore(p,filterBtns)
})

// for validating domains
const validateDomain = (domainName)=>{
  if(domainName.length == 4 && domainName[0]=='https:' && domainName[1]=="" && domainName[2]!="" && domainName[3]==""){
    return true
  }
  return false
}

//for saving Domains
const saveBtn = document.getElementById("saveBtn")
  saveBtn.addEventListener("click",()=>{
    li = hidden.getElementsByTagName("input")
    const arr = []
    let flag = -1
    for(i=0;i<li.length;i++){
      if(li[i].value != ""){
        let x = li[i].value.split("/")
        if(validateDomain(x)){
          arr.push(li[i].value)
        }
        else{
          flag= i+1
          break
        }
      }
    }
    let success = document.getElementById("success")
    if(flag>-1){
      success.innerText = "Domain: "+flag+" is Incorrect!"
      success.style.color  = "#DF4D55" 
      success.style.display = "block"
      setTimeout(()=>{
        success.style.display = "none"
      },3000)
    }  
    else{
    chrome.storage.sync.set({ "domainList":arr }, () => { 
      console.log("Saved Domains")
      // chrome.storage.local.set({"lru":{}}, function() { 
      //   console.log("LRU List Emptied")
      chrome.runtime.sendMessage({type:"FROM_CONTENT_TRUE"})
      // })
      // let success = document.getElementById("success")
      success.innerText = "*Saved Successfully!"
      success.style.color  = "lightseagreen" 
      success.style.display = "block"
      setTimeout(()=>{
        success.style.display = "none"
      },3000)
    })
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
        chrome.storage.local.set({"lru":{}}, function() { 
          console.log("LRU List Emptied")
          // chrome.runtime.sendMessage({type:"FROM_POPUP_FALSE"});
        })
        
      })
    }
    else{
        chrome.storage.sync.set({ "set":true }, () => { 
          btnId.style.backgroundColor = "green"
          chrome.runtime.sendMessage({type:"FROM_CONTENT_TRUE"});
        })
    }

  })
  })
  

