import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import server from './server'

function App() {

  const [isLogin, setIsLogin] = useState(false)
  const [nickName, setNickName] = useState("")
  const [msg, setMsg] = useState([])

  const msg_ref = useRef("")
  const nickname_ref = useRef("")
  const scroll_ref = useRef(0)

  function handleLoginClick(){
    server.emit('login', nickname_ref.current.value)
    setIsLogin(true)
    setNickName(nickname_ref.current.value)
  }

  //로그인시 엔터클릭
  function handleLoginKeyClick(e){
    if(e.key == 'Enter'){
      handleLoginClick()
    }
  }

  function handleSendClick(){
    if(msg_ref.current.value != ""){
      let msg_array = [...msg]
      msg_array.push({level:"me", msg:msg_ref.current.value})
      setMsg(msg_array)
      server.emit('send', {nickName:nickName, msg:msg_ref.current.value})
    }
  }

  //메세지전송시 엔터클릭
  function handleSendKeyClick(e){
    if(e.key == 'Enter'){
      handleSendClick()
    }
  }

  useEffect(()=>{
    if(scroll_ref.current){
      scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight
    }
    
    server.on('msg',(data)=>{
      let msg_array = [...msg]
      msg_array.push(data)
      setMsg(msg_array)
    })

    //메세지 전송후 인풋박스 클리어 + 나의 작성 메세지만 클리어
    if(msg_ref.current && msg[msg.length - 1].level == "me"){
      msg_ref.current.value = ""
    }

  },[msg])

  return (
    <div className="App">
      
      {!isLogin ?
        <div className='login_wrapper'>
          <div>NickName：<input ref={nickname_ref} onKeyPress={handleLoginKeyClick}></input></div>{/* 로그인 엔터클릭 */}
          <button onClick={handleLoginClick}>Enter</button>
        </div>
      :
        <div className='chatting_wrapper'>

          <div ref={scroll_ref} className='chatting_box'>
            {msg.map(c=>{
              return <div className='msg_box'
                  style={{
                    justifyContent: c.level == "sys" ? "center" : c.level == "" ? "start" : "end"}}>
                    <div className='nickname_style'>{c.nickName}</div> {/* 메세지 보낸 사람 닉네임 표시 */}
                    <div className={c.level == "sys" ? 'msg_center' : "msg"}>{c.msg}</div>
                </div>
            })
            }
          </div>
          
          <div className='input_box'>
            <input ref={msg_ref} onKeyPress={handleSendKeyClick}></input>{/* 메세지 엔터클릭 */}
            <button onClick={handleSendClick}>Send</button>
          </div>
        
        </div>
      }
    </div>
  );
}

export default App;
