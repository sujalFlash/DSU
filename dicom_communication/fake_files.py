import numpy as np
import pydicom
from pydicom.dataset import Dataset, FileDataset
import datetime
import os
from pydicom.uid import ImplicitVRLittleEndian, generate_uid

def create_dicom(output_path, patient_name="Sujal Jain V", patient_id="654321", rows=128, cols=128):
    # Create the DICOM dataset object
    file_meta = pydicom.dataset.FileMetaDataset()
    file_meta.MediaStorageSOPClassUID = pydicom.uid.CTImageStorage  # Standard SOP Class UID for CT images
    file_meta.MediaStorageSOPInstanceUID = generate_uid()
    file_meta.ImplementationClassUID = generate_uid()
    file_meta.TransferSyntaxUID = ImplicitVRLittleEndian

    # Create the dataset
    ds = FileDataset(output_path, {}, file_meta=file_meta, preamble=b"\0" * 128)

    # Add patient information
    ds.PatientName = patient_name
    ds.PatientID = patient_id
    ds.StudyInstanceUID = generate_uid()
    ds.SeriesInstanceUID = generate_uid()
    ds.SOPInstanceUID = file_meta.MediaStorageSOPInstanceUID
    ds.SOPClassUID = file_meta.MediaStorageSOPClassUID
    ds.file_meta = file_meta  # Assign the file meta to the dataset

    # Image data
    ds.Modality = 'CT'
    ds.ContentDate = str(datetime.date.today()).replace("-", "")
    ds.ContentTime = str(datetime.datetime.now().time()).replace(":", "").split(".")[0]

    # Set dimensions of the image
    ds.Rows = rows
    ds.Columns = cols

    # Create a random pixel array (replace with actual image data if needed)
    pixel_array = np.random.randint(0, 256, (rows, cols), dtype=np.uint8)

    # Set pixel data
    ds.PixelData = pixel_array.tobytes()

    # Set additional metadata
    ds.PhotometricInterpretation = "MONOCHROME2"
    ds.SamplesPerPixel = 1
    ds.BitsAllocated = 8
    ds.BitsStored = 8
    ds.HighBit = 7
    ds.PixelRepresentation = 0

    # Save the DICOM file
    ds.save_as(output_path)
    print(f"DICOM file saved as: {output_path}")

# Usage
output_dir = './'
output_file = os.path.join(output_dir, "test2.dcm")
create_dicom(output_file)
