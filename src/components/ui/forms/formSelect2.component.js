import React,{Fragment} from 'react'
import imgLoading1 from '../../../assets/loading1.gif'

export default (props) =>{
  let {changeLanguage,changeTheme,executar,loadingReponse} = props
  
  const themes = ['monokai','github','tomorrow','kuroir','twilight','xcode','textmate','solarized_dark','solarized_light','terminal']
  return(
    <Fragment>
            <div className="col-4 col-md-2">
            <label htmlFor="selectDifficulty">&nbsp; Linguagem: </label>
              <select className="form-control" onChange={changeLanguage}>
                <option value = 'javascript' >JavaScript</option>
                <option value = 'c_cpp'>C++</option>
              </select>
             </div>
            <div className="col-4 col-md-2">
              <label htmlFor="selectDifficulty">&nbsp; Tema: </label>
              <select defaultValue='monokai' className="form-control" onChange={changeTheme}>
                {
                  themes.map(thene=>(
                    <option key={thene} value ={thene}>{thene}</option>
                  ))
                }
              </select>
            </div>
            <div className="col-4 col-md-3">
                <label htmlFor="selectDifficul">&nbsp;</label>
                <button style={{width:"100%"}} className={`btn btn-primary ${loadingReponse && 'btn-loading'}`} onClick={executar}>
                  <i className="fa fa-play" /> &nbsp;&nbsp; Testar
                </button>
            </div>
      </Fragment>
  )
}