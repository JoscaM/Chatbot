import Swal from 'sweetalert2'
import botTraining from './botTraining';
class Alert {
  alertSuccess(message){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center-end',
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: 'success',
      title: message
    })
  }
  alertWarning(message){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center-end',
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: 'warning',
      title: message
    })
  }
  alertError(message){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center-end',
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: 'error',
      title: message
    })
  }
  async alertDeleteConfirm(data){
    let addbotTraining = new botTraining();
    const swalConfirm = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    return await swalConfirm.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then( async (result) =>   { 
        if (result.value) {
          let deleteRes = await addbotTraining.deleteEntity(data)
          
          
          if (!deleteRes.status){
            swalConfirm.fire(
              'Fail!',
              deleteRes.message,
              'warning',
            )}
          else {
            
            swalConfirm.fire(
              'Success!',
              'Delete completed!',
              'success')
              return deleteRes;  
          }
         
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {      // Read more about handling dismissals
          swalConfirm.fire(
            'Cancelled',
            'No activities were performed',
            'warning'
          )
        }
      
    })
  }
  alertUpdateConfirm(data){
    const swalConfirm = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    swalConfirm.fire({
      title: 'Are you sure?',
      text: "Your docs will be updated!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then( async (result) =>   {
        if (result.value) {
          // let a = 2;
          let deleteRes = await this.addbotTraining.deleteEntity(data)
          if (!deleteRes.status){
              //if (a===1){
            swalConfirm.fire(
              'Fail',
              deleteRes.message,
              // 'Fail to update!',
              'warning',
            )}
          else {
            swalConfirm.fire(
              'Success!',
              // deleteRes.message,
              'Update completed!',
              'success')
          }

          }
          else if (result.dismiss === Swal.DismissReason.cancel) {      // Read more about handling dismissals
            swalConfirm.fire(
              'Cancelled',
              'No activities were performed!',
              'warning'
            )
            }
      })
    }
}
export default Alert
