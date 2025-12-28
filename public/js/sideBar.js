            function toggleSidebar() {
                const sidebar = document.getElementById('adminSidebar');
                const content = document.getElementById('mainContent');

                // Sınıfları ekle/çıkar (Toggle)
                sidebar.classList.toggle('sidebar-closed');
                content.classList.toggle('full-width');
            }