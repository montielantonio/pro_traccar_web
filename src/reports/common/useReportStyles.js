import { makeStyles } from 'tss-react/mui';

export default makeStyles()((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  containerMap: {
    flexBasis: '40%',
    flexShrink: 0,
  },
  containerMain: {
    overflow: 'auto',
    backgroundColor: '#1A202C',
    borderRadius: '10px',
    border: '2px solid #00E5FF',
    boxShadow: '0 0 10px rgba(0, 229, 255, 0.5), 0 0 20px rgba(0, 229, 255, 0.3)',
    margin: theme.spacing(2),
    padding: theme.spacing(1),
    '& .MuiTable-root': {
      backgroundColor: 'transparent',
      '& .MuiTableHead-root': {
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        '& .MuiTableCell-head': {
          color: '#FFFFFF',
          fontWeight: 600,
          fontSize: '0.875rem',
          letterSpacing: '0.02em',
          borderBottom: '2px solid rgba(0, 229, 255, 0.3)',
          padding: theme.spacing(1.5, 2),
        },
      },
      '& .MuiTableBody-root': {
        '& .MuiTableRow-root': {
          '&:hover': {
            backgroundColor: 'rgba(0, 229, 255, 0.05)',
          },
          '& .MuiTableCell-body': {
            color: '#FFFFFF',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: theme.spacing(1.5, 2),
            fontSize: '0.875rem',
            '& a': {
              color: '#00E5FF',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                color: '#00D4FF',
              },
            },
          },
        },
      },
    },
  },
  header: {
    position: 'sticky',
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#1A202C',
    padding: theme.spacing(2),
    borderRadius: '10px 10px 0 0',
  },
  columnAction: {
    width: '1%',
    paddingLeft: theme.spacing(1),
    color: '#FFFFFF',
    '@media print': {
      display: 'none',
    },
    // Style for IconButtons in column action cells
    '& .MuiIconButton-root': {
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#00E5FF',
      },
      '& .MuiSvgIcon-root': {
        color: '#FFFFFF',
      },
    },
  },
  columnActionContainer: {
    display: 'flex',
  },
  filter: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    padding: theme.spacing(3, 2, 2),
    backgroundColor: '#1A202C',
    '@media print': {
      display: 'none !important',
    },
    // Style for FormControl, InputLabel, Select, and TextField
    '& .MuiFormControl-root': {
      '& .MuiInputLabel-root': {
        color: '#FFFFFF',
        '&.Mui-focused': {
          color: '#00E5FF',
        },
      },
      '& .MuiInputBase-root': {
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
        '&.Mui-focused': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
        '& .MuiSelect-select': {
          color: '#FFFFFF',
        },
        '& .MuiInputBase-input': {
          color: '#FFFFFF',
        },
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#00E5FF',
        },
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
    },
    // Style for Select dropdown menu
    '& .MuiMenu-paper': {
      backgroundColor: '#1A202C',
      border: '1px solid #00E5FF',
      '& .MuiMenuItem-root': {
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: 'rgba(0, 229, 255, 0.1)',
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(0, 229, 255, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(0, 229, 255, 0.3)',
          },
        },
      },
    },
    // Style for TextField
    '& .MuiTextField-root': {
      '& .MuiInputLabel-root': {
        color: '#FFFFFF',
        '&.Mui-focused': {
          color: '#00E5FF',
        },
      },
      '& .MuiOutlinedInput-root': {
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
        '&.Mui-focused': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#00E5FF',
        },
      },
    },
    // Style for Autocomplete (used in SelectField)
    '& .MuiAutocomplete-root': {
      '& .MuiInputLabel-root': {
        color: '#FFFFFF',
        '&.Mui-focused': {
          color: '#00E5FF',
        },
      },
      '& .MuiOutlinedInput-root': {
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
        '&.Mui-focused': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#00E5FF',
        },
      },
    },
    // Style for Buttons
    '& .MuiButton-root': {
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: '#00E5FF',
        color: '#FFFFFF',
      },
      '&.Mui-disabled': {
        color: 'rgba(255, 255, 255, 0.3)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      },
      '& .MuiTypography-root': {
        color: '#FFFFFF',
      },
    },
    // Style for ButtonGroup (used in SplitButton)
    '& .MuiButtonGroup-root': {
      '& .MuiButton-root': {
        color: '#FFFFFF',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderColor: '#00E5FF',
          color: '#FFFFFF',
        },
        '&.Mui-disabled': {
          color: 'rgba(255, 255, 255, 0.3)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
        '& .MuiTypography-root': {
          color: '#FFFFFF',
        },
        '& .MuiSvgIcon-root': {
          color: '#FFFFFF',
        },
      },
    },
  },
  filterItem: {
    minWidth: 0,
    flex: `1 1 ${theme.dimensions.filterFormWidth}`,
  },
  filterButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    flex: `1 1 ${theme.dimensions.filterFormWidth}`,
  },
  filterButton: {
    flexGrow: 1,
  },
  chart: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  actionCellPadding: {
    '&.MuiTableCell-body': {
      paddingTop: 0,
      paddingBottom: 0,
      color: '#FFFFFF',
    },
    '@media print': {
      display: 'none',
    },
    // Style for IconButtons in action cells (delete, edit buttons)
    '& .MuiIconButton-root': {
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#00E5FF',
      },
      '& .MuiSvgIcon-root': {
        color: '#FFFFFF',
      },
    },
  },
}));
