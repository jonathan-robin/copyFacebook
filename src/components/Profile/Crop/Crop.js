import React from 'react'

function Crop() {
    return (
        <div>
                                 <ImageCropper
                        getBlob={props.getBlob}
                        inputImg={props.inputImg}
                    /> 
        </div>
    )
}

export default Crop
