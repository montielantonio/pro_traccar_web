import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';
import fetchOrThrow from '../util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  addressLink: {
    color: '#00E5FF',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#00D4FF',
      textDecoration: 'underline',
    },
  },
  addressText: {
    color: '#FFFFFF',
    fontWeight: 400,
    fontSize: '0.875rem',
  },
}));

const AddressValue = ({ latitude, longitude, originalAddress }) => {
  const { classes } = useStyles();
  const t = useTranslation();

  const addressEnabled = useSelector((state) => state.session.server.geocoderEnabled);

  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(originalAddress);
  }, [latitude, longitude, originalAddress]);

  const showAddress = useCatch(async (event) => {
    event.preventDefault();
    const query = new URLSearchParams({ latitude, longitude });
    const response = await fetchOrThrow(`/api/server/geocode?${query.toString()}`);
    setAddress(await response.text());
  });

  if (address) {
    return <span className={classes.addressText}>{address}</span>;
  }
  if (addressEnabled) {
    return (<Link href="#" onClick={showAddress} className={classes.addressLink}>{t('sharedShowAddress')}</Link>);
  }
  return '';
};

export default AddressValue;
