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