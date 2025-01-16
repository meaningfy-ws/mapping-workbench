import {useState} from 'react';

import Button from '@mui/material/Button';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const ExportButton = ({handleExport}) => {
    const [isExporting, setIsExporting] = useState(false)

    return (
        <Button
            onClick={() => handleExport(setIsExporting)}
            disabled={isExporting}
            startIcon={<FileDownloadOutlinedIcon/>}
        >
            {isExporting ? "Exporting..." : "Export State"}
        </Button>
    )
}

export default ExportButton