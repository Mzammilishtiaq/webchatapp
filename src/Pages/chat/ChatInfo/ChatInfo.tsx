import M from '../../../assets/img/M.jpg'
function ChatInfo() {
  return (
    <div className="userinfo">
      <div className="user">
        <img src={M} alt="" />
        <h2>John Doe</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
      </div>
      <div className="info">
        <div className="title">
          <span>chat Setting</span>
          
        </div>
      </div>
    </div>
  )
}

export default ChatInfo
