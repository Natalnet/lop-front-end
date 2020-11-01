/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Main React component that includes the Blockly component.
 * @author samelh@google.com (Sam El-Husseini)
 */

//https://developers.google.com/blockly/guides/configure/web/fixed-size
//import React,{ forwardRef,useRef } from 'react';
import BlocklyComponent, { Block, Value, Field, Shadow, Category } from './Blockly';
import BlocklyLanguage from 'blockly/python';
import Blockly from 'blockly';
import './blocks/customblocks';
import './generator/generator';

//export default BlocklyComponent;
export {
  BlocklyComponent,
  BlocklyLanguage,
  Block,
  Value,
  Field,
  Shadow,
  Category,
  Blockly,
}
// const  BlocklyWrapper = (props, ref)=>{

//   const simpleWorkspace = useRef(null);

//   generateCode = () => {
//     const code = BlocklyLanguage.workspaceToCode(
//       simpleWorkspace.current.workspace
//     );
//     console.log(code);
//     return code;
//   }
//   generateXML = () => {
//     const xml = Blockly.Xml.workspaceToDom(
//       simpleWorkspace.current.workspace
//     );
//     console.log(xml);
//     return xml;
//   }

  
//     return (
//       <>
//       {/* <button onClick={generateCode} type='button'>Convert</button>
//       <button onClick={generateXML}  type='button'>Convert xml</button> */}
//         <BlocklyComponent
//           ref={this.simpleWorkspace}
//           readOnly={false}
//           trashcan={true}
//           media={'media/'}
//           move={{
//             scrollbars: true,
//             drag: true,
//             wheel: true
//           }}
//           initialXml={`
//             <xml xmlns="http://www.w3.org/1999/xhtml">
//             <block type="controls_ifelse" x="300" y="0"></block>
//             </xml>
//           `}>
//           <Category name="Text" colour="20">
//             {/* <Block type="variables_get" />
//             <Block type="variables_set" /> */}
//             <Block type="text" />
//             <Block type="text_print" />
//             <Block type="text_prompt" />
//           </Category>
//           <Category name="Variables" colour="330" custom="VARIABLE"></Category>
//           <Category name="Logic" colour="210">
//             <Block type="controls_if" />
//             <Block type="controls_ifelse" />
//             <Block type="logic_compare" />
//             <Block type="logic_operation" />
//             <Block type="logic_boolean" />
//             <Block type="logic_null" />
//             <Block type="logic_ternary" />
//           </Category>
//           <Category name="Loops" colour="120">
//             <Block type="controls_for"/>
//             <Block type="controls_whileUntil"/>
//             <Block type="controls_repeat_ext">
//               <Value name="TIMES">
//                 <Shadow type="math_number">
//                   <Field name="NUM">10</Field>
//                 </Shadow>
//               </Value>
//             </Block>
//           </Category>
//           <Category name="Math" colour="230">
//             <Block type="math_number" />
//             <Block type="math_arithmetic" />
//           </Category>
//           <Category name="Functions" colour="290" custom="PROCEDURE"></Category>
//         </BlocklyComponent>
//       </>
//     );
// }
//export default forwardRef(BlocklyWrapper);
