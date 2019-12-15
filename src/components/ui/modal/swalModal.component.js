import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default (props) =>{
	const {title,show,handleModal,allowOutsideClick,allowEnterKey,allowEscapeKey,children,cancelButtonText,confirmButtonText,width} = props
	const SwalReact = withReactContent(Swal)
	if(show){
		SwalReact.fire({
			title:<p>{title || ''}</p>,
			html:children,
			width:width || '60%',
			showConfirmButton:false,
			showCancelButton:false,
			showCloseButton:true,
			confirmButtonText:confirmButtonText || 'Ok',
			cancelButtonText:cancelButtonText || 'Cancel',
	        allowOutsideClick: allowOutsideClick===false?false:true,
	        allowEscapeKey: allowEscapeKey===false?false:true,
	        allowEnterKey: allowEnterKey===false?false:true,
			onClose: () => {
	    		handleModal()
	  		}
		})
	}
	return null
}