import './index.scss'
export default function MainLayout({ children, left }) {
  return (
    <div className={`main-layout main-layout-flex`}>
      <div className="main-layout-left">
        {left}
      </div>
      <div className="main-layout-content">
        {children}
      </div>

    </div >
  )
}