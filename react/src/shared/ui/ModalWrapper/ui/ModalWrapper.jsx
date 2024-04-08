import 'shared/ui/ModalWrapper/ui/modalWrapper.scss'

export const ModalWrapper = ({children, onClick, nodeRef}) => {
  return (
    <div ref={nodeRef} className='modalWrapper'>{children}</div>
  )
}
