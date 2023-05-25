import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const platformOptions = ['Web', 'Node.js', 'Python', 'C#'];

export const CourseSearch = () => {
  return (
    <Card>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={3}
        sx={{ p: 3 }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            defaultValue=""
            fullWidth
            label="Search"
            name="query"
            placeholder="Title or description"
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            defaultValue="web"
            fullWidth
            label="Platform"
            name="platform"
            select
            SelectProps={{ native: true }}
          >
            {platformOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </TextField>
        </Box>
        <div>
          <DatePicker
            format="dd/MM/yyyy"
            label="From"
            onChange={() => { }}
            value={new Date()}
          />
        </div>
        <div>
          <DatePicker
            format="dd/MM/yyyy"
            label="To"
            onChange={() => { }}
            value={new Date()}
          />
        </div>
        <Button
          size="large"
          startIcon={(
            <SvgIcon>
              <SearchMdIcon />
            </SvgIcon>
          )}
          variant="contained"
        >
          Search
        </Button>
      </Stack>
    </Card>
  );
};
