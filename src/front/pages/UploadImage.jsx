import { useState } from "react";


// latam70

// https://api.cloudinary.com/v1_1/dd0wschpy/image/upload -X POST --data 'file=sample.jpg&upload_preset=unsigned_1'

// 

const UploadImage = () => {

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {

        console.log("File selected:", event.target.files[0]);

        const image = event.target.files[0];
        setSelectedFile(image);
    };

    const uploadToCloudinary = async () => {
        if (!selectedFile) {
            console.error("No file selected for upload.");
            return;
        }
        const formData = new FormData();
        console.log("Uploading file:", formData);
        formData.append("file", selectedFile);
        formData.append("upload_preset", "latam70");
        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dd0wschpy/image/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            console.log("Upload successful:", data.url);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };


    return (
        <div className="container mt-5">
            <h1>Upload Image Page</h1>
            <p>This is the upload image page. You can add your image upload form here.</p>

            <div className="mt-4">
                <div className="input-group mb-3">
                    {!selectedFile && <>
                        <input type="file" multiple={false}
                            accept="image/*" className="form-control" id="inputGroupFile02"
                            onChange={handleFileChange}
                        />
                        <label className="input-group-text" htmlFor="inputGroupFile02">
                            Upload
                        </label>
                    </>}

                    {
                        selectedFile && (
                            <div className="d-flex align-items-center">
                                <img src={URL.createObjectURL(selectedFile)} alt="Selected"
                                    className="img-thumbnail object-fit-cover me-2"
                                    style={{ width: '100px', height: '100px' }}
                                />
                                <span>{selectedFile.name}</span>
                                <button className="btn btn-danger ms-3" onClick={() => setSelectedFile(null)}>
                                    Remove
                                </button>
                            </div>
                        )
                    }

                    {
                        selectedFile && (
                            <div className="mt-3">
                                <button className="btn btn-primary" onClick={() => uploadToCloudinary()}>
                                    Upload to Cloudinary
                                </button>
                            </div>
                        )
                    }

                </div>
            </div>

        </div>
    );
};

export default UploadImage;