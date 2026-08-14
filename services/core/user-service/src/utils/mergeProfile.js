exports.getMergedProfile = (profile, storeId) => {
  const store = profile.storefrontProfiles?.get?.(storeId) || {};
  const merged = {
    ...profile,
    preferences: {
      ...profile.preferences,
      ...store.preferences,
    },
    addresses: store.addresses?.length ? store.addresses : profile.addresses,
    compliance: store.compliance || {},
  };
  // Remove the raw storefrontProfiles from output (optional)
  delete merged.storefrontProfiles;
  return merged;
};