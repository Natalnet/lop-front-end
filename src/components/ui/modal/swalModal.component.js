import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default (props) =>{
	const {title,show,handleModal,children,width,loading} = props
	const SwalReact = withReactContent(Swal)
	if(show){
		SwalReact.fire({
			title:<p>{title || ''}</p>,
			html:children,
			width:width,
			showConfirmButton:false,
			showCloseButton:true,
			onClose: () => {
	    		handleModal()
	  		}
		})
	}
	return null
}