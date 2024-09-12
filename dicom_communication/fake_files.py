import pydicom
from pydicom.dataset import Dataset, FileMetaDataset

file_meta = FileMetaDataset()
file_meta.MediaStorageSOPClassUID = pydicom.uid.CTImageStorage
file_meta.MediaStorageSOPInstanceUID = pydicom.uid.generate_uid()
file_meta.ImplementationClassUID = pydicom.uid.generate_uid()

ds = Dataset()
ds.file_meta = file_meta
ds.is_little_endian = True
ds.is_implicit_VR = True

ds.PatientName = "John Doe"
ds.PatientID = "123456"
ds.Rows = 256
ds.Columns = 256
ds.SamplesPerPixel = 1
ds.PhotometricInterpretation = "MONOCHROME2"
ds.BitsAllocated = 8
ds.BitsStored = 8
ds.HighBit = 7
ds.PixelRepresentation = 0

ds.PixelData = bytes([0] * (256 * 256))

ds.save_as("generated_sample.dcm")
