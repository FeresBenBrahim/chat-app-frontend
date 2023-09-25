import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import './home.css'
import { setUser, setUsers } from './../store/slices/userSlice'
import { setMessages, addMessage } from '../store/slices/messageSlice';
import { useDispatch, useSelector } from 'react-redux'
import { setConv, changeLastMessage, setActiveConversation, addConversation } from '../store/slices/conversationSlice';
import { logout } from './../store/slices/userSlice';
import { useLocation } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import './home.css'
import { socket } from '../socket/socket';
import Card from '../components/Card/Card';
import User from '../components/User/User';
import Message from '../components/Message/Message';
function Home() {
  const dispatch = useDispatch()
  const { user, users, userToDM } = useSelector((state) => state.userReducer);
  const { conversations, isError, isLoading, message, activeConversation } = useSelector((state) => state.conversationReducer);
  const { messages } = useSelector((state) => state.messageReducer);
  const [loggedIn, setLoggedIn] = useState(true);
  const [loading, setLoading] = useState(isLoading);
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false)

  const Navigate = useNavigate()
  const clickHandler = async () => {
    setLoading(true)
    localStorage.removeItem("tk");
    setLoading(false)
    setLoggedIn(false);
    dispatch(logout());
    return Navigate('/login');
  }
  useEffect(() => {

    let token = localStorage.getItem("tk");
    if (token + "" == "undefined" || token === null || token === undefined || !token) {
      return Navigate('/login');
    }
    let config = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const me = async () => {
      setLoading(true)
      await axios.get('https://tasty-shift.cyclic.app/api/me', config).then((res) => {
        dispatch(setUser(res.data?.data));
        socket.emit("CONNECT", { ...res?.data?.data, socketID: socket.id })
        setLoading(false);
      });
    }
    const getUsers = async () => {
      setLoading(true)
      await axios.get('https://tasty-shift.cyclic.app/api/users', config).then((res) => {
        dispatch(setUsers(res.data.data));
        setLoading(false);
      });
    }
    const setConversations = async () => {
      setLoading(true)
      await axios.get('https://tasty-shift.cyclic.app/api/conversations', config).then((res) => {
        dispatch(setConv(res?.data.data));
        setLoading(false);
      });
    }
    me();
    getUsers()
    setConversations()


  }, [])
  useEffect(() => {
    socket.on("MESSAGE", (data) => {
      dispatch(addMessage(data));
      dispatch(changeLastMessage({
        content: data?.content,
        conversation: data?.conversation
      }));
    })

  }, [socket])

  const getMessages = async (convID) => {
    if (convID) {
      setLoading(true)
      let token = localStorage.getItem("tk");
      if (token + "" == "undefined" || token === null || token === undefined || !token) {
        return () => {
          return Navigate('/login');
        }
      }
      let config = {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      await axios.get(`https://tasty-shift.cyclic.app/api/messages/${convID}`, config).then((res) => {
        dispatch(setMessages(res.data?.data?.messages));
        setLoading(false);
      });
    }
  }

  const sendHandler = async (e) => {
    e.preventDefault();
    let token = localStorage.getItem("tk");
    if (token + "" == "undefined" || token === null || token === undefined || !token) {
      return () => {
        return Navigate('/login');
      }
    }
    let config = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    if (activeConversation) {

      let usertodm = activeConversation?.with?._id === user?._id ? activeConversation?.createdBy : activeConversation?.with
         dispatch(changeLastMessage({
          content,
          conversation: activeConversation?._id
        }));

        setContent("");
        await axios.post("https://tasty-shift.cyclic.app/api/messages", {
          conversation: activeConversation?._id,
          content,
          createdAt: Date.now()
        }, config)
        dispatch(addMessage({
          createdBy: { _id: user?._id },
          content,
          createdAt: Date.now(),
          conversation: activeConversation?._id
        }));
      socket.emit('MESSAGE', {
        usertodm, message: {
          createdBy: { _id: user?._id },
          content,
          createdAt: Date.now(),
          conversation: activeConversation?._id
        }
      });

    } else {
      await axios.post("https://tasty-shift.cyclic.app/api/messages", {
        content,
        createdAt: Date.now(),
        with: userToDM?._id
      }, config).then((res) => {
        socket.emit('MESSAGE', userToDM)
                 dispatch(addConversation(res?.data?.data?.conversation));
          dispatch(setActiveConversation(res?.data?.data?.conversation));
          dispatch(addMessage(
            {
              createdBy: { _id: user?._id },
              content,
              createdAt: Date.now(),
              conversation: res?.data?.data?.conversation?._id
            }
          ));
      })
    }

  }
  return (
    <>
      {loading && <Spinner />}
      <div className='header'>
        {user && `Welcome back ${user?.firstName}`}
        <nav>
          <ul>
            <button className='btn' onClick={clickHandler}>Logout</button>
          </ul>
        </nav>
      </div>
      <div className='main-container'>
        <div className='conversations-container'>
          {
            conversations?.length > 0 && conversations.map((conversation) =>
              <Card with={conversation?.with} createdBy={conversation?.createdBy}
                updatedAt={conversation?.updatedAt}
                setIsOpen={setIsOpen}
                getMessages={getMessages} conversation={conversation}
                dispatch={dispatch} id={conversation?._id}
                title={user?._id === conversation?.createdBy?._id ? conversation?.with?.firstName + " " +
                  conversation?.with?.lastName : user?._id === conversation?.with?._id ? conversation?.createdBy?.firstName + ' ' + conversation?.createdBy?.lastName : ""} content={conversation?.lastMessage?.content} />
            )
          }

        </div>
        {isOpen && <div class="chat-card-container">
          <div class="chat-card-header">
            <div className='user-name' >
              <div class="img-avatar"></div>
              <div class="text-chat">{activeConversation && user?._id === activeConversation?.createdBy?._id ? activeConversation?.with?.firstName + " " +
                activeConversation?.with?.lastName : user?._id === activeConversation?.with?._id ? activeConversation?.createdBy?.firstName + ' '
                  + activeConversation?.createdBy?.lastName : userToDM && userToDM?.firstName + ' ' + userToDM?.lastName}</div>
            </div>
            <button onClick={() => setIsOpen(false)} className='close-btn btn'> Close</button>

          </div>
          <div class="chat-card-body">
            <div class="messages-container">
              {
                messages?.length > 0 && messages?.map((msg) => <Message userID={user?._id} content={msg?.content} createdBy={msg?.createdBy?._id} />)
              }
            </div>
            <div class="message-input">
              <form>
                <textarea value={content} placeholder="Type your message here" class="message-send" onChange={(e) => setContent(e.target.value)}></textarea>
                <button type="submit" class="button-send" onClick={(e) => sendHandler(e)}>Send</button>
              </form>
            </div>
          </div>
        </div>}
        <div className='users-container'>
          {users?.length > 0 && users?.map((el) => {
            return (
              <User setIsOpen={setIsOpen} getMessages={getMessages} id={el?._id} dispatch={dispatch} firstName={el?.firstName} lastName={el?.lastName} img={el?.img} />
            )
          })}
        </div>

      </div>

    </>

  )
}

export default Home
