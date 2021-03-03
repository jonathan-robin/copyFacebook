
import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './CropImage'
import '../../../styles/Profile.css';

const EasyCrop = ({ getBlob, inputImg }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const onCropComplete = async (_, croppedAreaPixels) => {
        const croppedImage = await getCroppedImg(
            inputImg,
            croppedAreaPixels
        )
        getBlob(croppedImage)
    }

    return (
        <div >
            <Cropper
                style={{ zIndex: 0 }}
                image={inputImg}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
            />
        </div>
    )
}

export default EasyCrop