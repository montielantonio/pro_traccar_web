export default {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.default,
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      sizeMedium: {
        height: '40px',
      },
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      enterDelay: 500,
      enterNextDelay: 500,
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        '@media print': {
          color: theme.palette.alwaysDark.main,
        },
      }),
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: '#1A202C',
        color: '#FFFFFF',
        borderRadius: '10px',
        border: '2px solid #00E5FF',
        boxShadow: '0 0 10px rgba(0, 229, 255, 0.5), 0 0 20px rgba(0, 229, 255, 0.3)',
        // Scope ListItemButton styles to only apply within drawer
        '& .MuiListItemButton-root': {
          borderRadius: '10px',
          margin: '4px 8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          position: 'relative',
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            color: '#FFFFFF',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              backgroundColor: '#0052FF',
              borderRadius: '0 2px 2px 0',
            },
            '&:hover': {
              backgroundColor: 'rgba(0, 82, 255, 0.08)',
            },
            '& .MuiListItemIcon-root': {
              color: '#FFFFFF',
            },
            '& .MuiListItemText-primary': {
              color: '#FFFFFF',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          '& .MuiListItemIcon-root': {
            color: '#FFFFFF',
            minWidth: '40px',
          },
          '& .MuiListItemText-primary': {
            color: '#FFFFFF',
          },
        },
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
        margin: '4px 8px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
  },
  MuiListSubheader: {
    styleOverrides: {
      root: {
        backgroundColor: '#1A202C',
        color: '#FFFFFF',
        fontWeight: 500,
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        backgroundColor: '#1A202C',
        border: '1px solid #00E5FF',
        boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
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
          // Ensure all Typography inside MenuItem is white
          '& .MuiTypography-root': {
            color: '#FFFFFF !important',
          },
          // Ensure error color Typography is also visible (use lighter red)
          '& .MuiTypography-colorError': {
            color: '#FF6B6B !important',
          },
        },
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      paper: {
        backgroundColor: '#1A202C',
        border: '1px solid #00E5FF',
        boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
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
          // Ensure all Typography inside MenuItem is white
          '& .MuiTypography-root': {
            color: '#FFFFFF !important',
          },
          // Ensure error color Typography is also visible (use lighter red)
          '& .MuiTypography-colorError': {
            color: '#FF6B6B !important',
          },
        },
      },
    },
  },
};
