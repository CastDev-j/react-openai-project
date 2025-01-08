import './TypingLoader.css'

interface TypingLoaderProps {
    className?: string
}

export const TypingLoader = ({className}: TypingLoaderProps) => {
  return (
    <div className={`typing ${className}`}>
        <span className="circle scaling"></span>
        <span className="circle scaling"></span>
        <span className="circle scaling"></span>
    </div>
  )
}
