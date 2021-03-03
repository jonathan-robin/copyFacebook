const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.src = url
        image.header = 'Access-Control-Allow-Origin'
        image.crossOrigin = "Anonymous";
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
    })

export const getCroppedImg = async (imageSrc, crop) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = 900;
    canvas.height = 350;

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        canvas.width,
        canvas.height
    )

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob)
        }, 'image/jpeg')
    })
}