chrome.runtime.onMessage.addListener((obj)=>{
    if(obj.type==="FROM_CONTENT_TRUE"){
        console.log("INSIDE BACKGROUND when TRUE")
        // window.onload = ()=>{
        chrome.tabs.query( {
            // gets the window the user can currently see
            active: true, 
            currentWindow: true 
            },function(tabs){
            chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT,
            function(dataurl){
                console.log("POPup",dataurl)
                //   chrome.tabs.sendMessage(tabs[0].id,dataurl);
                // chrome.processes.getProcessIdForTab(tabs[0].id,(processId)=>{
                //     console.log(processId)
                // })
                console.log("tabs",tabs[0])
                chrome.tabs.sendMessage(tabs[0].id,{type:"FROM_BACKGROUND_TRUE",dataurl:dataurl,iconurl:tabs[0].favIconUrl});
            
            })
            })
        // }
    }
    else{
        // console.log(window)
        console.log("INSIDE BACKGROUND when False")
    }
})


chrome.runtime.onMessage.addListener(obj => {
    if(obj.type==="FROM_POPUP"){

    
        if(obj.value){
            // window.onload = ()=>{
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
            // }
        }
        else{
            // window.onload = ()=>{
            // chrome.runtime.sendMessage({type:"FROM_BACKGROUND_FALSE"});
            chrome.tabs.query( {
                // gets the window the user can currently see
                active: true, 
                currentWindow: true 
            },function(tabs){
            chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT,
                function(dataurl){
                    console.log("POPup",dataurl)
                    console.log("tabs",tabs[0])
                    // chrome.processes.getProcessIdForTab(tabs[0].id,(processId)=>{
                    //     console.log(processId)
                    // })
                    chrome.tabs.sendMessage(tabs[0].id,{type:"FROM_BACKGROUND_FALSE",dataurl:dataurl,iconurl:tabs[0].favIconUrl});
                
                })
            })

        // }
        }
}

})