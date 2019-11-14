import React, { Component } from 'react';
// import '../../../css/manageQuestion.css'

class Question_Manage extends Component {
    state = {  }
    render() { 
        return (  
            
                <tr className='question'>
                    <th scope="row">
                        <i className="fa fa-plus" aria-hidden="true" onClick={this.onShowContent}></i> &nbsp;
                        Question1</th>
                    <td>Icon</td>
                </tr>
                // <tr className='question_content'>
                //     <td>
                //         <div>cccccccccccccc</div>
                //     </td>
                //     <td></td>
                // </tr>
           
        );
    }
}
 
export default Question_Manage;