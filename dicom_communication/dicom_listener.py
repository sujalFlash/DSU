import os
import logging
import datetime
from pynetdicom import AE, evt, ALL_TRANSFER_SYNTAXES, StoragePresentationContexts
import pydicom
from dicom_communication.models import DICOMFile

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('dicom_listener.log'),
        logging.StreamHandler()
    ]
)

# Event handler for storing received DICOM files
def handle_store(event):
    try:
        ds = event.dataset  # Use event.dataset directly
        ds.file_meta = event.file_meta
    except Exception as e:
        logging.error(f"Failed to read DICOM file: {str(e)}")
        return 0xC001  # Error code for failed store

    logging.info("Handling received DICOM file")

    # Ensure the directory exists
    save_dir = 'dicom_files'
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    # Save the DICOM file to disk
    save_path = os.path.join(save_dir, f"{ds.SOPInstanceUID}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.dcm")
    logging.info(f"Saving DICOM file to: {save_path}")
    try:
        ds.save_as(save_path, write_like_original=False)
    except Exception as e:
        logging.error(f"Failed to save DICOM file: {str(e)}")
        return 0xC001

    # Extract metadata and print for debug
    patient_id = getattr(ds, 'PatientID', 'Unknown')
    study_instance_uid = getattr(ds, 'StudyInstanceUID', 'Unknown')
    modality = getattr(ds, 'Modality', 'Unknown')

    logging.info(f"Patient ID: {patient_id}")
    logging.info(f"Study Instance UID: {study_instance_uid}")
    logging.info(f"Modality: {modality}")

    # Save to the database
    try:
        DICOMFile.objects.create(
            file=save_path,
            patient_id=patient_id,
            study_instance_uid=study_instance_uid,
            modality=modality
        )
        logging.info(f"Successfully saved DICOM file metadata to database: {save_path}")
    except Exception as e:
        logging.error(f"Failed to save DICOM file to database: {str(e)}")

    return 0x0000

def start_dicom_listener(port=1502, ae_title='YOUR_AE_TITLE'):
    ae = AE()

    # Set the AE Title for the server
    ae.ae_title = ae_title

    # Add all supported storage presentation contexts
    for context in StoragePresentationContexts:
        ae.add_supported_context(context.abstract_syntax, ALL_TRANSFER_SYNTAXES)

    handlers = [(evt.EVT_C_STORE, handle_store)]

    logging.debug(f"Starting DICOM listener on port {port} with AE Title {ae_title}...")
    try:
        ae.start_server(('', port), evt_handlers=handlers)
    except Exception as e:
        logging.error(f"Failed to start DICOM listener: {str(e)}")

