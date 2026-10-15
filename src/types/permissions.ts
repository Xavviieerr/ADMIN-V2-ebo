// Permission type for individual permission items
export interface Permission {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  // Full API response type
  export interface PermissionsResponse {
    data: Permission[];
    message: string;
  }
  
  // Single admin permission response
  export interface SinglePermissionResponse {
    data: Record<string, boolean>;
    message: string;    
  }

  // Permission request types
  export interface SetPermissionRequest {
    permissions: Record<string, boolean>;
    userId?: string; // Optional for PATCH requests
    method?: 'POST' | 'PATCH';
  }

  // Permission mapping for UI
  export interface PermissionMapping {
    [key: string]: {
      category: string;
      title: string;
      description: string;
    };
  }

  // Permission mapping configuration
  export const PERMISSION_MAPPING: PermissionMapping = {
    // Dictionary permissions
    'add_word': {
      category: 'dictionary',
      title: 'Add Words',
      description: 'Can add new words to the dictionary'
    },
    'view_word': {
      category: 'dictionary',
      title: 'View Dictionary',
      description: 'Can view dictionary entries and search words'
    },
    'edit_word': {
      category: 'dictionary',
      title: 'Edit Words',
      description: 'Can modify existing dictionary entries: add sense, delete sense, add translation, delete translation, update sense, update translation'
    },
    'delete_word': {
      category: 'dictionary',
      title: 'Delete Words',
      description: 'Can remove words from the dictionary'
    },
    'moderate_word': {
      category: 'dictionary',
      title: 'Moderate Words',
      description: 'Can approve, reject, and set words to review status'
    },
    'add_media': {
      category: 'dictionary',
      title: 'Add Media',
      description: 'Can upload audio and images for senses and translations'
    },
    'delete_media': {
      category: 'dictionary',
      title: 'Delete Media',
      description: 'Can remove audio and images from senses and translations'
    },
    
    // User management permissions
    'create_user': {
      category: 'user',
      title: 'Add Users',
      description: 'Can create new user accounts'
    },
    'view_user': {
      category: 'user',
      title: 'View Users',
      description: 'Can view user profiles and information'
    },
    'edit_user': {
      category: 'user',
      title: 'Edit Users',
      description: 'Can modify user information and settings'
    },
    'delete_user': {
      category: 'user',
      title: 'Delete Users',
      description: 'Can remove user accounts'
    },
    
    // Province management permissions
    'create_province': {
      category: 'province',
      title: 'Add Provinces',
      description: 'Can create new provinces and towns'
    },
    'view_province': {
      category: 'province',
      title: 'View Provinces',
      description: 'Can view province and town information'
    },
    'edit_province': {
      category: 'province',
      title: 'Edit Provinces',
      description: 'Can modify province and town details'
    },
    'delete_province': {
      category: 'province',
      title: 'Delete Provinces',
      description: 'Can remove provinces and towns'
    },

    // Place management permissions
    'create_place': {
      category: 'place',
      title: 'Add Places',
      description: 'Can create new guonopedia places'
    },
    'view_place': {
      category: 'place',
      title: 'View Places',
      description: 'Can view guonopedia place information'
    },
    'edit_place': {
      category: 'place',
      title: 'Edit Places',
      description: 'Can modify guonopedia place details'
    },
    'delete_place': {
      category: 'place',
      title: 'Delete Places',
      description: 'Can remove guonopedia places'
    },
    'moderate_place': {
      category: 'place',
      title: 'Moderate Places',
      description: 'Can approve and reject guonopedia places'
    },
    // Figure management permissions
    'create_figure': {
      category: 'figure',
      title: 'Add Figures',
      description: 'Can create new guonopedia figures'
    },
    'view_figure': {
      category: 'figure',
      title: 'View Figures',
      description: 'Can view guonopedia figure information'
    },
    'edit_figure': {
      category: 'figure',
      title: 'Edit Figures',
      description: 'Can modify guonopedia figure details'
    },
    'delete_figure': {
      category: 'figure',
      title: 'Delete Figures',
      description: 'Can remove guonopedia figures'
    },
    'moderate_figure': {
      category: 'figure',
      title: 'Moderate Figures',
      description: 'Can approve and reject guonopedia figures'
    },
    // Town management permissions
    'create_town': {
      category: 'town',
      title: 'Add Towns',
      description: 'Can create new towns'
    },
    'view_town': {
      category: 'town',
      title: 'View Towns',
      description: 'Can view town information'
    },
    'edit_town': {
      category: 'town',
      title: 'Edit Towns',
      description: 'Can modify town details'
    },
    'delete_town': {
      category: 'town',
      title: 'Delete Towns',
      description: 'Can remove towns'
    },
    // Admin management permissions
    'create_admin': {
      category: 'admin',
      title: 'Add Admins',
      description: 'Can create new admin accounts'
    },
    // Name management permissions
    'create_name': {
      category: 'name',
      title: 'Add Names',
      description: 'Can create new guonopedia names'
    },
    'view_name': {
      category: 'name',
      title: 'View Names',
      description: 'Can view guonopedia name information'
    },
    'edit_name': {
      category: 'name',
      title: 'Edit Names',
      description: 'Can modify guonopedia name details'
    },
    'delete_name': {
      category: 'name',
      title: 'Delete Names',
      description: 'Can remove guonopedia names'
    },
    'moderate_name': {
      category: 'name',
      title: 'Moderate Names',
      description: 'Can approve and reject guonopedia names'
    }
  };

  // Helper function to convert API permission name to UI format
  export const convertPermissionName = (apiName: string): string => {
    return apiName.replace(/_/g, '-');
  };

  // Helper function to convert UI permission name to API format
  export const convertToApiName = (uiName: string): string => {
    return uiName.replace(/-/g, '_');
  };