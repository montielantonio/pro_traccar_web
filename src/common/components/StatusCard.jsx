import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Menu,
  MenuItem,
  CardMedia,
  TableFooter,
  Link,
  Tooltip,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import RouteIcon from '@mui/icons-material/Route';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';

import { useTranslation } from './LocalizationProvider';
import RemoveDialog from './RemoveDialog';
import PositionValue from './PositionValue';
import { useDeviceReadonly, useRestriction } from '../util/permissions';
import usePositionAttributes from '../attributes/usePositionAttributes';
import { devicesActions } from '../../store';
import { useCatch, useCatchCallback } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';
import fetchOrThrow from '../util/fetchOrThrow';

const useStyles = makeStyles()((theme, { desktopPadding }) => ({
  card: {
    pointerEvents: 'auto',
    width: '320px',
    minWidth: '280px',
    maxWidth: '90vw',
    backgroundColor: '#1A202C',
    borderRadius: '10px',
    border: '2px solid #00E5FF',
    boxShadow: '0 0 15px rgba(0, 229, 255, 0.6), 0 0 30px rgba(0, 229, 255, 0.4)',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
  },
  media: {
    height: theme.dimensions.popupImageHeight,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    borderRadius: '8px 8px 0 0',
  },
  mediaButton: {
    color: theme.palette.common.white,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderRadius: '8px 8px 0 0',
    borderBottom: '1px solid rgba(0, 229, 255, 0.3)',
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '1rem',
    letterSpacing: '0.02em',
  },
  closeButton: {
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  content: {
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    maxHeight: '50vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#1A202C',
    flex: 1,
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(0, 229, 255, 0.5)',
      borderRadius: '3px',
      '&:hover': {
        background: 'rgba(0, 229, 255, 0.7)',
      },
    },
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  table: {
    width: '100%',
    '& .MuiTableCell-sizeSmall': {
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    },
    '& .MuiTableCell-sizeSmall:first-of-type': {
      paddingRight: theme.spacing(2),
      width: '40%',
      minWidth: '120px',
    },
    '& .MuiTableCell-sizeSmall:last-of-type': {
      paddingLeft: theme.spacing(2),
      textAlign: 'right',
    },
  },
  cell: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
  },
  cellText: {
    color: '#FFFFFF',
    fontWeight: 500,
    fontSize: '0.875rem',
    letterSpacing: '0.01em',
  },
  cellTextSecondary: {
    color: '#FFFFFF',
    fontWeight: 400,
    fontSize: '0.875rem',
    letterSpacing: '0.01em',
  },
  link: {
    color: '#00E5FF',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
    display: 'inline-block',
    padding: theme.spacing(0.5, 0),
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#00D4FF',
      textDecoration: 'underline',
      transform: 'translateX(2px)',
    },
  },
  actions: {
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    borderRadius: '0 0 8px 8px',
    borderTop: '1px solid rgba(0, 229, 255, 0.3)',
  },
  actionButton: {
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: 'rgba(0, 229, 255, 0.1)',
      transform: 'scale(1.1)',
    },
  },
  actionButtonError: {
    color: 'rgba(255, 87, 87, 0.7)',
    '&:hover': {
      color: '#FF5757',
      backgroundColor: 'rgba(255, 87, 87, 0.1)',
      transform: 'scale(1.1)',
    },
  },
  root: {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 1300,
    left: '50%',
    [theme.breakpoints.up('md')]: {
      left: `calc(50% + ${desktopPadding} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      left: '50%',
      bottom: `calc(${theme.spacing(3)} + ${theme.dimensions.bottomBarHeight}px)`,
    },
    transform: 'translateX(-50%)',
  },
}));

const StatusRow = ({ name, content }) => {
  const { classes } = useStyles({ desktopPadding: 0 });

  return (
    <TableRow>
      <TableCell className={classes.cell}>
        <Typography variant="body2" className={classes.cellText}>{name}</Typography>
      </TableCell>
      <TableCell className={classes.cell}>
        <Typography variant="body2" className={classes.cellTextSecondary}>{content}</Typography>
      </TableCell>
    </TableRow>
  );
};

const StatusCard = ({ deviceId, position, onClose, disableActions, desktopPadding = 0 }) => {
  const { classes } = useStyles({ desktopPadding });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const deviceReadonly = useDeviceReadonly();

  const shareDisabled = useSelector((state) => state.session.server.attributes.disableShare);
  const user = useSelector((state) => state.session.user);
  const device = useSelector((state) => state.devices.items[deviceId]);

  const deviceImage = device?.attributes?.deviceImage;

  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference('positionItems', 'fixTime,address,speed,totalDistance');

  const navigationAppLink = useAttributePreference('navigationAppLink');
  const navigationAppTitle = useAttributePreference('navigationAppTitle');

  const [anchorEl, setAnchorEl] = useState(null);

  const [removing, setRemoving] = useState(false);

  const handleRemove = useCatch(async (removed) => {
    if (removed) {
      const response = await fetchOrThrow('/api/devices');
      dispatch(devicesActions.refresh(await response.json()));
    }
    setRemoving(false);
  });

  const handleGeofence = useCatchCallback(async () => {
    const newItem = {
      name: t('sharedGeofence'),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetchOrThrow('/api/geofences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    const item = await response.json();
    await fetchOrThrow('/api/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
    });
    navigate(`/settings/geofence/${item.id}`);
  }, [navigate, position]);

  return (
    <>
      <div className={classes.root}>
        {device && (
          <Rnd
            default={{ x: 0, y: 0, width: 'auto', height: 'auto' }}
            enableResizing={false}
            dragHandleClassName="draggable-header"
            style={{ position: 'relative' }}
          >
            <Card elevation={3} className={classes.card}>
              {deviceImage ? (
                <CardMedia
                  className={`${classes.media} draggable-header`}
                  image={`/api/media/${device.uniqueId}/${deviceImage}`}
                >
                  <IconButton
                    size="small"
                    onClick={onClose}
                    onTouchStart={onClose}
                  >
                    <CloseIcon fontSize="small" className={classes.mediaButton} />
                  </IconButton>
                </CardMedia>
              ) : (
                <div className={`${classes.header} draggable-header`}>
                  <Typography variant="body2" className={classes.headerText}>
                    {device.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={onClose}
                    onTouchStart={onClose}
                    className={classes.closeButton}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              )}
              {position ? (
                <CardContent className={classes.content}>
                  <Table size="small" classes={{ root: classes.table }}>
                    <TableBody>
                      {positionItems.split(',').filter((key) => position.hasOwnProperty(key) || position.attributes.hasOwnProperty(key)).map((key) => (
                        <StatusRow
                          key={key}
                          name={positionAttributes[key]?.name || key}
                          content={(
                            <PositionValue
                              position={position}
                              property={position.hasOwnProperty(key) ? key : null}
                              attribute={position.hasOwnProperty(key) ? null : key}
                            />
                          )}
                        />
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell 
                          colSpan={2} 
                          className={classes.cell} 
                          style={{ borderBottom: 'none', paddingTop: '16px', paddingBottom: 0 }}
                        >
                          <Typography variant="body2" style={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to={`/position/${position.id}`} className={classes.link}>
                              {t('sharedShowDetails')}
                            </Link>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CardContent>
              ) : (
                <CardContent className={classes.content}>
                  <Typography variant="body2" className={classes.cellText} style={{ textAlign: 'center', padding: '20px' }}>
                    {t('sharedNoData')}
                  </Typography>
                </CardContent>
              )}
              <CardActions classes={{ root: classes.actions }} disableSpacing>
                <Tooltip title={t('sharedExtra')}>
                  <span>
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      disabled={!position}
                      className={classes.actionButton}
                    >
                      <PendingIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={t('reportReplay')}>
                  <span>
                    <IconButton
                      onClick={() => navigate(`/replay?deviceId=${deviceId}`)}
                      disabled={disableActions || !position}
                      className={classes.actionButton}
                    >
                      <RouteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={t('commandTitle')}>
                  <span>
                    <IconButton
                      onClick={() => navigate(`/settings/device/${deviceId}/command`)}
                      disabled={disableActions}
                      className={classes.actionButton}
                    >
                      <SendIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={t('sharedEdit')}>
                  <span>
                    <IconButton
                      onClick={() => navigate(`/settings/device/${deviceId}`)}
                      disabled={disableActions || deviceReadonly}
                      className={classes.actionButton}
                    >
                      <EditIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={t('sharedRemove')}>
                  <span>
                    <IconButton
                      onClick={() => setRemoving(true)}
                      disabled={disableActions || deviceReadonly}
                      className={classes.actionButtonError}
                    >
                      <DeleteIcon/>
                    </IconButton>
                  </span>
                </Tooltip>
              </CardActions>
            </Card>
          </Rnd>
        )}
      </div>
      {position && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {!readonly && <MenuItem onClick={handleGeofence}>{t('sharedCreateGeofence')}</MenuItem>}
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}>{t('linkGoogleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}>{t('linkAppleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}>{t('linkStreetView')}</MenuItem>
          {navigationAppTitle && <MenuItem component="a" target="_blank" href={navigationAppLink.replace('{latitude}', position.latitude).replace('{longitude}', position.longitude)}>{navigationAppTitle}</MenuItem>}
          {!shareDisabled && !user.temporary && (
            <MenuItem onClick={() => navigate(`/settings/device/${deviceId}/share`)}><Typography color="secondary">{t('deviceShare')}</Typography></MenuItem>
          )}
        </Menu>
      )}
      <RemoveDialog
        open={removing}
        endpoint="devices"
        itemId={deviceId}
        onResult={(removed) => handleRemove(removed)}
      />
    </>
  );
};

export default StatusCard;
